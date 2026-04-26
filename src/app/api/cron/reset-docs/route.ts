import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET ?? "";
  const auth   = request.headers.get("authorization") ?? "";

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("suscripciones")
    .update({ documentos_mes: 0, actualizado_en: new Date().toISOString() })
    .neq("estado", "canceled");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, reset_at: new Date().toISOString() });
}
