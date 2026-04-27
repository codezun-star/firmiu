import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { escapeHtml } from "@/lib/security";

const REMINDER_HOURS = 48;

function reminderEmailHtml(opts: {
  ownerName: string;
  destinatario: string;
  titulo: string;
  signingUrl: string;
  lang: "es" | "en";
}): string {
  const { ownerName, destinatario, titulo, signingUrl, lang } = opts;
  const ownEsc = escapeHtml(ownerName);
  const destEsc = escapeHtml(destinatario);
  const titEsc = escapeHtml(titulo);

  if (lang === "en") {
    return `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:0;background:#ffffff">
  <div style="background:#1a3c5e;padding:24px 32px;border-radius:12px 12px 0 0">
    <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px">firmiu</span>
  </div>
  <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <h2 style="color:#111827;font-size:18px;margin:0 0 12px">You have a document pending signature</h2>
    <p style="color:#374151;margin:0 0 16px;line-height:1.6">Hello <strong>${destEsc}</strong>,</p>
    <p style="color:#374151;margin:0 0 24px;line-height:1.6">
      This is a reminder that you have a document pending signature for more than 48 hours:
    </p>
    <div style="background:#f8f9fa;border:1px solid #e5e7eb;border-radius:10px;padding:16px 20px;margin:0 0 24px;text-align:center">
      <span style="font-size:15px;font-weight:700;color:#111827">&ldquo;${titEsc}&rdquo;</span>
    </div>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${signingUrl}" style="background:#f97316;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;font-size:15px">
        Sign now &rarr;
      </a>
    </div>
    <p style="color:#6b7280;font-size:13px;margin:0 0 16px">Sent by <strong>${ownEsc}</strong></p>
    <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 16px">
    <p style="color:#9ca3af;font-size:12px;margin:0">
      This is an automatic reminder from Firmiu. If you have already signed this document, you can ignore this message.
    </p>
  </div>
</div>`;
  }

  return `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:0;background:#ffffff">
  <div style="background:#1a3c5e;padding:24px 32px;border-radius:12px 12px 0 0">
    <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px">firmiu</span>
  </div>
  <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Tienes un documento pendiente de firma</h2>
    <p style="color:#374151;margin:0 0 16px;line-height:1.6">Hola <strong>${destEsc}</strong>,</p>
    <p style="color:#374151;margin:0 0 24px;line-height:1.6">
      Te recordamos que tienes un documento pendiente de firma desde hace más de 48 horas:
    </p>
    <div style="background:#f8f9fa;border:1px solid #e5e7eb;border-radius:10px;padding:16px 20px;margin:0 0 24px;text-align:center">
      <span style="font-size:15px;font-weight:700;color:#111827">&ldquo;${titEsc}&rdquo;</span>
    </div>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${signingUrl}" style="background:#f97316;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;font-size:15px">
        Firmar ahora &rarr;
      </a>
    </div>
    <p style="color:#6b7280;font-size:13px;margin:0 0 16px">Enviado por <strong>${ownEsc}</strong></p>
    <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 16px">
    <p style="color:#9ca3af;font-size:12px;margin:0">
      Este es un recordatorio automático de Firmiu. Si ya firmaste este documento podés ignorar este mensaje.
    </p>
  </div>
</div>`;
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET ?? "";
  const auth   = request.headers.get("authorization") ?? "";

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin  = createAdminClient();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";

  const cutoff = new Date(Date.now() - REMINDER_HOURS * 60 * 60 * 1000).toISOString();
  const reminderCutoff = new Date(Date.now() - REMINDER_HOURS * 60 * 60 * 1000).toISOString();

  // Fetch docs pending/visto, older than 48h, not hidden, reminder not sent or sent >48h ago
  const { data: docs, error: docsError } = await admin
    .from("documentos")
    .select("id, owner_id, titulo, nombre_destinatario, correo_destinatario, token, ultimo_recordatorio")
    .in("estado", ["pendiente", "visto"])
    .eq("oculto", false)
    .lt("creado_en", cutoff)
    .or(`ultimo_recordatorio.is.null,ultimo_recordatorio.lt.${reminderCutoff}`);

  if (docsError) {
    return NextResponse.json({ error: docsError.message }, { status: 500 });
  }

  if (!docs || docs.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  // Get unique owner IDs
  const ownerIds = Array.from(new Set(docs.map((d) => d.owner_id)));

  // Fetch subscriptions for those owners — only pro and business plans are eligible
  const { data: subs } = await admin
    .from("suscripciones")
    .select("owner_id, plan, estado")
    .in("owner_id", ownerIds)
    .in("plan", ["pro", "business"])
    .eq("estado", "active");

  const eligibleOwners = new Set((subs ?? []).map((s) => s.owner_id));

  // Fetch owner names from auth.users via admin
  const { data: usersData } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const userMap = new Map<string, string>();
  for (const u of usersData?.users ?? []) {
    const nombre = (u.user_metadata?.nombre as string | undefined) ?? u.email ?? "Firmiu";
    userMap.set(u.id, nombre);
  }

  let sent = 0;

  for (const doc of docs) {
    if (!eligibleOwners.has(doc.owner_id)) continue;

    const ownerName = userMap.get(doc.owner_id) ?? "Firmiu";
    const signingUrl = `${appUrl}/firmar/${doc.token}`;

    try {
      await resend.emails.send({
        from: "Firmiu <noreply@firmiu.com>",
        to: doc.correo_destinatario,
        subject: `Recordatorio: tienes un documento pendiente de firma`,
        html: reminderEmailHtml({
          ownerName,
          destinatario: doc.nombre_destinatario,
          titulo: doc.titulo,
          signingUrl,
          lang: "es",
        }),
      });

      // Update ultimo_recordatorio (non-fatal if column doesn't exist yet)
      try {
        await admin
          .from("documentos")
          .update({ ultimo_recordatorio: new Date().toISOString() })
          .eq("id", doc.id);
      } catch {
        // Migration 007 may not be applied yet
      }

      sent++;
    } catch {
      // Email failed — continue with next document
    }
  }

  console.log(`[cron/recordatorios] ${sent} recordatorios enviados`);
  return NextResponse.json({ ok: true, sent });
}
