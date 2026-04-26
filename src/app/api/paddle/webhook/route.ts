import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

// Price ID → plan mapping
const PRICE_PLAN: Record<string, { plan: string; limit: number }> = {
  pri_01kq422bt1wz29n1q4vwn1p82m: { plan: "starter", limit: 30 },
  pri_01kq426n7d2nb2yn1kahrjy99j: { plan: "pro", limit: 999999 },
  pri_01kq42frwhz0kxg9mfs613zhq4: { plan: "business", limit: 999999 },
};

function mapStatus(status: string): string {
  switch (status) {
    case "active":   return "active";
    case "canceled": return "canceled";
    case "past_due": return "past_due";
    case "paused":   return "paused";
    default:         return "active";
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

  if (secret) {
    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: WebhookPayload;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event_type, data } = payload;
  const admin = createAdminClient();

  console.log("[paddle-webhook] event:", event_type);
  console.log("[paddle-webhook] sub:", data.id);
  console.log("[paddle-webhook] custom_data:", JSON.stringify(data.custom_data ?? null));
  console.log("[paddle-webhook] customer:", JSON.stringify(data.customer ?? null));

  if (event_type === "subscription.created" || event_type === "subscription.activated") {
    const priceId  = data.items?.[0]?.price?.id ?? "";
    const planInfo = PRICE_PLAN[priceId] ?? { plan: "starter", limit: 30 };

    console.log("[paddle-webhook] priceId:", priceId, "→ plan:", planInfo.plan);
    console.log("[paddle-webhook] body completo:", JSON.stringify({ event_type, data }, null, 2));

    let ownerId = data.custom_data?.owner_id;
    console.log("[paddle-webhook] owner_id desde custom_data:", ownerId);

    // Fallback: buscar usuario por email del cliente si owner_id no llegó
    if (!ownerId) {
      const customerEmail = data.customer?.email;
      console.log("[paddle-webhook] owner_id null — buscando por email:", customerEmail);

      if (customerEmail) {
        try {
          const { data: { users } } = await admin.auth.admin.listUsers();
          const found = users?.find((u) => u.email === customerEmail);
          ownerId = found?.id;
          console.log("[paddle-webhook] owner_id encontrado por email:", ownerId);
        } catch (e) {
          console.error("[paddle-webhook] error buscando usuario por email:", e);
        }
      }
    }

    if (!ownerId) {
      console.error("[paddle-webhook] no se pudo obtener owner_id — custom_data:", data.custom_data);
      await logWebhook(admin, event_type, data.custom_data, null, "error: owner_id not found");
      // Retornamos 200 para evitar reintentos de Paddle que nunca resolverán este caso
      return NextResponse.json({ ok: true, warning: "owner_id_missing" });
    }

    try {
      const { data: upsertData, error } = await admin.from("suscripciones").upsert(
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
      console.log("[paddle-webhook] upsert data:", JSON.stringify(upsertData));
      console.log("[paddle-webhook] upsert error:", JSON.stringify(error));

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
        limite_documentos: 3,
        actualizado_en:    new Date().toISOString(),
      })
      .eq("paddle_subscription_id", data.id);
  }

  return NextResponse.json({ ok: true });
}
