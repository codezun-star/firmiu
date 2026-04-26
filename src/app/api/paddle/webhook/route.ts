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

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature") ?? "";
  const secret = process.env.PADDLE_WEBHOOK_SECRET ?? "";

  // Verify signature when secret is configured
  if (secret) {
    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: {
    event_type: string;
    data: {
      id: string;
      status?: string;
      customer_id?: string;
      items?: Array<{ price: { id: string } }>;
      current_billing_period?: { starts_at: string; ends_at: string };
      custom_data?: { owner_id?: string };
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event_type, data } = payload;
  console.log("[paddle-webhook] event:", event_type, "sub:", data.id, "custom_data:", JSON.stringify(data.custom_data ?? null));
  const admin = createAdminClient();

  if (event_type === "subscription.created" || event_type === "subscription.activated") {
    const priceId  = data.items?.[0]?.price?.id ?? "";
    const planInfo = PRICE_PLAN[priceId] ?? { plan: "starter", limit: 30 };
    const ownerId  = data.custom_data?.owner_id;

    console.log("[paddle-webhook] body completo:", JSON.stringify({ event_type, data }, null, 2));
    console.log("[paddle-webhook] custom_data:", JSON.stringify(data.custom_data ?? null));
    console.log("[paddle-webhook] owner_id:", ownerId);
    console.log("[paddle-webhook] priceId:", priceId, "→ plan:", planInfo.plan);

    if (!ownerId) {
      console.error("[paddle-webhook] missing owner_id — customData:", data.custom_data);
      return NextResponse.json({ error: "Missing owner_id" }, { status: 400 });
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
    } catch (e) {
      console.error("[paddle-webhook] excepcion en upsert:", e);
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
      updates.plan             = planInfo.plan;
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

  // transaction.completed — no action needed beyond subscription events
  return NextResponse.json({ ok: true });
}
