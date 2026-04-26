"use server";

import { redirect } from "next/navigation";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { escapeHtml, isValidEmail, sanitizeText } from "@/lib/security";

export type DocumentState = {
  errorKey: string | null;
  success: boolean;
  destinatario?: string;
  titulo?: string;
};

function getPrefix(locale: string): string {
  return locale === "es" ? "" : `/${locale}`;
}

export async function uploadDocumentAction(
  prevState: DocumentState,
  formData: FormData
): Promise<DocumentState> {
  const locale = (formData.get("locale") as string) ?? "es";
  const pdfFile = formData.get("pdf") as File | null;
  const nombreDestinatario = sanitizeText((formData.get("nombre_destinatario") as string) ?? "", 100);
  const correoDestinatario = ((formData.get("correo_destinatario") as string) ?? "").trim().toLowerCase().slice(0, 320);

  if (!pdfFile || pdfFile.size === 0) {
    return { errorKey: "pdf_required", success: false };
  }
  if (!pdfFile.name.toLowerCase().endsWith(".pdf")) {
    return { errorKey: "pdf_invalid", success: false };
  }
  if (pdfFile.size > 20 * 1024 * 1024) {
    return { errorKey: "pdf_too_large", success: false };
  }
  if (!nombreDestinatario) {
    return { errorKey: "name_required", success: false };
  }
  if (!isValidEmail(correoDestinatario)) {
    return { errorKey: "email_invalid", success: false };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`${getPrefix(locale)}/login`);

  const admin = createAdminClient();

  // Plan limit check
  let planLimit = 3;
  let subId: string | null = null;
  let subDocsMes = 0;

  const { data: sub, error: subError } = await admin
    .from("suscripciones")
    .select("id, documentos_mes, limite_documentos, estado")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!subError && sub?.estado === "active") {
    planLimit  = sub.limite_documentos;
    subId      = sub.id;
    subDocsMes = sub.documentos_mes ?? 0;

    if (subDocsMes >= planLimit) {
      return { errorKey: "plan_limit_reached", success: false };
    }
  } else {
    // Free plan — count actual docs from this calendar month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("documentos")
      .select("id", { count: "exact", head: true })
      .gte("creado_en", startOfMonth.toISOString());

    if ((count ?? 0) >= planLimit) {
      return { errorKey: "plan_limit_reached", success: false };
    }
  }

  const docId = crypto.randomUUID();
  const storagePath = `${user.id}/${docId}.pdf`;
  const titulo = pdfFile.name.replace(/\.pdf$/i, "");

  // 1. Upload PDF to storage
  const pdfBuffer = await pdfFile.arrayBuffer();
  const { error: uploadError } = await admin.storage
    .from("pdfs-originales")
    .upload(storagePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    return { errorKey: "upload_failed", success: false };
  }

  // 2. Insert document row (user session — goes through RLS)
  const { data: doc, error: docError } = await supabase
    .from("documentos")
    .insert({
      id: docId,
      owner_id: user.id,
      titulo,
      nombre_destinatario: nombreDestinatario,
      correo_destinatario: correoDestinatario,
      url_pdf_original: storagePath,
    })
    .select("token")
    .single();

  if (docError || !doc) {
    await admin.storage.from("pdfs-originales").remove([storagePath]);
    return { errorKey: "generic", success: false };
  }

  // 3. Insert firma row with verification code (admin — RLS requires service role)
  const verificationCode = String(Math.floor(1000 + Math.random() * 9000));
  await admin.from("firmas").insert({
    documento_id: docId,
    codigo_verificacion: verificationCode,
  });

  // 4. Send email to recipient (non-fatal)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const signingUrl = `${appUrl}/firmar/${doc.token}`;
  const ownerName = escapeHtml((user.user_metadata?.nombre as string | undefined) ?? "Alguien");
  const tituloEscaped = escapeHtml(titulo);

  // Dev log — shows signing info in terminal without needing email delivery
  if (process.env.NODE_ENV === "development") {
    console.log("\n──────────────────────────────────────────");
    console.log("📄 FIRMIU — Nuevo documento creado");
    console.log(`   Título:   ${titulo}`);
    console.log(`   Para:     ${correoDestinatario}`);
    console.log(`   Token:    ${doc.token}`);
    console.log(`   Código:   ${verificationCode}`);
    console.log(`   URL:      ${signingUrl}`);
    console.log("──────────────────────────────────────────\n");
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: correoDestinatario,
      subject: `${ownerName} te envió un documento para firmar`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:0;background:#ffffff">
          <!-- Header -->
          <div style="background:#1a3c5e;padding:24px 32px;border-radius:12px 12px 0 0">
            <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px">firmiu</span>
          </div>
          <!-- Body -->
          <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
            <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Tienes un documento para firmar</h2>
            <p style="color:#374151;margin:0 0 24px;line-height:1.6">
              <strong>${ownerName}</strong> te ha enviado el documento <strong>&ldquo;${tituloEscaped}&rdquo;</strong> para que lo firmes digitalmente.
            </p>
            <p style="color:#374151;margin:0 0 8px;font-size:14px;font-weight:600">Tu código de verificación:</p>
            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:20px;text-align:center;margin:0 0 24px">
              <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#f97316">${verificationCode}</span>
            </div>
            <a href="${signingUrl}" style="background:#f97316;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;font-size:15px;margin:0 0 24px">
              Firmar documento →
            </a>
            <p style="color:#9ca3af;font-size:12px;margin:0;border-top:1px solid #f3f4f6;padding-top:16px">
              Si no esperabas este documento, puedes ignorar este correo.<br>
              Este enlace es de uso único y expira una vez firmado.
            </p>
          </div>
        </div>
      `,
    });
  } catch {
    // Email failed — document is created, signing link remains valid
  }

  // Increment monthly counter for paid plans (non-fatal if migration not applied)
  if (subId) {
    await admin
      .from("suscripciones")
      .update({ documentos_mes: subDocsMes + 1, actualizado_en: new Date().toISOString() })
      .eq("id", subId);
  }

  return { errorKey: null, success: true, destinatario: nombreDestinatario, titulo };
}
