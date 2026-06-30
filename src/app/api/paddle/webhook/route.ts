import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLAN_LIMITS } from "@/lib/plans";

// Price ID → plan mapping, built from the SAME env vars the checkout uses.
// CRÍTICO: los price IDs de Paddle sandbox y producción son DISTINTOS. Si se
// hardcodearan los de sandbox, en producción ningún pago coincidiría y todos
// caerían al fallback (starter). Leerlos de env hace que funcione en ambos
// entornos siempre que NEXT_PUBLIC_PADDLE_PRICE_* esté bien configurado.
function buildPricePlan(): Record<string, { plan: string; limit: number }> {
  const map: Record<string, { plan: string; limit: number }> = {};
  const s = process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER;
  const p = process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO;
  const b = process.env.NEXT_PUBLIC_PADDLE_PRICE_BUSINESS;
  if (s) map[s] = { plan: "starter", limit: PLAN_LIMITS.starter.monthly };
  if (p) map[p] = { plan: "pro", limit: PLAN_LIMITS.pro.monthly };
  if (b) map[b] = { plan: "business", limit: PLAN_LIMITS.business.monthly };
  return map;
}
const PRICE_PLAN = buildPricePlan();

function mapStatus(status: string): string {
  switch (status) {
    case "active":   return "active";
    case "trialing": return "active"; // trials get access
    case "canceled": return "canceled";
    case "past_due": return "past_due";
    case "paused":   return "paused";
    // Unknown status: return as-is. It won't match the "active"/"canceling"
    // access gate, so we fail closed (treated as free) instead of granting
    // access on an unexpected status.
    default:         return status || "past_due";
  }
}

function verifySignature(rawBody: string, header: string, secret: string): boolean {
  const ts  = header.split(";").find((p) => p.startsWith("ts="))?.slice(3);
  const h1  = header.split(";").find((p) => p.startsWith("h1="))?.slice(3);
  if (!ts || !h1) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${ts}:${rawBody}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(h1));
  } catch {
    return false;
  }
}

interface WebhookPayload {
  event_type: string;
  data: {
    id: string;
    status?: string;
    customer_id?: string;
    customer?: { email?: string };
    items?: Array<{ price: { id: string } }>;
    current_billing_period?: { starts_at: string; ends_at: string };
    custom_data?: { owner_id?: string } | null;
  };
}

async function logWebhook(
  admin: ReturnType<typeof createAdminClient>,
  evento: string,
  customData: unknown,
  ownerId: string | undefined | null,
  resultado: string
) {
  try {
    await admin.from("webhook_logs").insert({
      evento,
      custom_data: JSON.stringify(customData),
      owner_id: ownerId ?? null,
      resultado,
      creado_en: new Date().toISOString(),
    });
  } catch {
    // tabla puede no existir todavía — ignorar
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature") ?? "";
  const secret = process.env.PADDLE_WEBHOOK_SECRET ?? "";
  const isProd = process.env.NEXT_PUBLIC_PADDLE_ENV === "production";

  if (secret) {
    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else if (isProd) {
    // Fail CLOSED in production: without a secret the signature can't be
    // verified, so anyone could POST a fake subscription.created to grant
    // themselves a paid plan for free. Never process unsigned webhooks live.
    console.error("[paddle-webhook] PADDLE_WEBHOOK_SECRET no configurado en producción — rechazando webhook");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let payload: WebhookPayload;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event_type, data } = payload;
  const admin = createAdminClient();

  // Log only non-PII operational data (no body/email/custom_data dumps —
  // these land in Vercel logs and would leak customer emails).
  console.log("[paddle-webhook] event:", event_type, "sub:", data.id);

  if (event_type === "subscription.created" || event_type === "subscription.activated") {
    const priceId  = data.items?.[0]?.price?.id ?? "";
    if (!PRICE_PLAN[priceId]) {
      console.error("[paddle-webhook] priceId NO reconocido — revisa NEXT_PUBLIC_PADDLE_PRICE_* en este entorno:", priceId);
    }
    const planInfo = PRICE_PLAN[priceId] ?? { plan: "starter", limit: PLAN_LIMITS.starter.monthly };

    let ownerId = data.custom_data?.owner_id;

    // Fallback: buscar usuario por email del cliente si owner_id no llegó
    if (!ownerId) {
      const customerEmail = data.customer?.email;

      if (customerEmail) {
        const target = customerEmail.toLowerCase();
        try {
          // Paginate: listUsers() returns only the first page (~50 users), so
          // it silently fails to find anyone once the user base grows.
          const perPage = 200;
          for (let page = 1; page <= 50 && !ownerId; page++) {
            const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
            if (error || !data?.users?.length) break;
            const found = data.users.find((u) => u.email?.toLowerCase() === target);
            if (found) ownerId = found.id;
            if (data.users.length < perPage) break; // last page reached
          }
          console.log("[paddle-webhook] owner_id encontrado por email:", ownerId);
        } catch (e) {
          console.error("[paddle-webhook] error buscando usuario por email:", e);
        }
      }
    }

    if (!ownerId) {
      console.error("[paddle-webhook] no se pudo obtener owner_id para sub:", data.id);
      await logWebhook(admin, event_type, data.custom_data, null, "error: owner_id not found");
      // Retornamos 200 para evitar reintentos de Paddle que nunca resolverán este caso
      return NextResponse.json({ ok: true, warning: "owner_id_missing" });
    }

    try {
      const { error } = await admin.from("suscripciones").upsert(
        {
          owner_id:               ownerId,
          paddle_subscription_id: data.id,
          paddle_customer_id:     data.customer_id ?? null,
          plan:                   planInfo.plan,
          estado:                 mapStatus(data.status ?? "active"),
          limite_documentos:      planInfo.limit,
          documentos_mes:         0,
          periodo_inicio:         data.current_billing_period?.starts_at ?? null,
          periodo_fin:            data.current_billing_period?.ends_at ?? null,
          actualizado_en:         new Date().toISOString(),
        },
        { onConflict: "owner_id" }
      );
      if (error) console.error("[paddle-webhook] upsert error:", error.message);

      const resultado = error ? `error: ${error.message}` : "ok";
      await logWebhook(admin, event_type, data.custom_data, ownerId, resultado);
    } catch (e) {
      console.error("[paddle-webhook] excepcion en upsert:", e);
      await logWebhook(admin, event_type, data.custom_data, ownerId, `exception: ${String(e)}`);
    }
  }

  if (event_type === "subscription.updated") {
    const priceId  = data.items?.[0]?.price?.id ?? "";
    const planInfo = PRICE_PLAN[priceId];

    const updates: Record<string, unknown> = {
      estado:         mapStatus(data.status ?? "active"),
      actualizado_en: new Date().toISOString(),
    };

    if (planInfo) {
      updates.plan              = planInfo.plan;
      updates.limite_documentos = planInfo.limit;
    }
    if (data.current_billing_period) {
      updates.periodo_inicio = data.current_billing_period.starts_at;
      updates.periodo_fin    = data.current_billing_period.ends_at;
    }

    await admin
      .from("suscripciones")
      .update(updates)
      .eq("paddle_subscription_id", data.id);
  }

  if (event_type === "subscription.canceled") {
    await admin
      .from("suscripciones")
      .update({
        estado:            "canceled",
        plan:              "free",
        limite_documentos: PLAN_LIMITS.free.monthly,
        actualizado_en:    new Date().toISOString(),
      })
      .eq("paddle_subscription_id", data.id);
  }

  return NextResponse.json({ ok: true });
}
