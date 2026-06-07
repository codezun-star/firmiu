"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { escapeHtml, isValidEmail, isValidUUID, sanitizeText } from "@/lib/security";
import { getPrefix } from "@/lib/utils";

export type DocumentState = {
  errorKey: string | null;
  success: boolean;
  destinatario?: string;
  titulo?: string;
};

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
  if (!pdfFile.name.toLowerCase().endsWith(".pdf") || pdfFile.type !== "application/pdf") {
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

  if (!subError && (sub?.estado === "active" || sub?.estado === "canceling")) {
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
      from: "Firmiu <noreply@firmiu.com>",
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

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/documentos");
  revalidatePath("/en/dashboard");
  revalidatePath("/en/dashboard/documentos");
  return { errorKey: null, success: true, destinatario: nombreDestinatario, titulo };
}

export async function resendSigningEmailAction(
  id: string,
  locale: string
): Promise<{ error: string | null }> {
  if (!isValidUUID(id)) return { error: "generic" };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "generic" };

  // RLS verifies ownership implicitly
  const { data: doc } = await supabase
    .from("documentos")
    .select("id, titulo, nombre_destinatario, correo_destinatario, estado, token")
    .eq("id", id)
    .eq("owner_id", user.id)
    .eq("oculto", false)
    .single();

  if (!doc) return { error: "generic" };
  if (doc.estado === "firmado") return { error: "already_signed" };

  const admin = createAdminClient();
  const { data: firma } = await admin
    .from("firmas")
    .select("codigo_verificacion")
    .eq("documento_id", doc.id)
    .single();

  if (!firma) return { error: "generic" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const signingUrl = `${appUrl}/firmar/${doc.token}`;
  const ownerName = escapeHtml((user.user_metadata?.nombre as string | undefined) ?? "Alguien");
  const tituloEscaped = escapeHtml(doc.titulo);
  const verificationCode = firma.codigo_verificacion;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Firmiu <noreply@firmiu.com>",
      to: doc.correo_destinatario,
      subject: `${ownerName} te reenvió un documento para firmar`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:0;background:#ffffff">
          <div style="background:#1a3c5e;padding:24px 32px;border-radius:12px 12px 0 0">
            <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px">firmiu</span>
          </div>
          <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
            <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Documento pendiente de firma</h2>
            <p style="color:#374151;margin:0 0 24px;line-height:1.6">
              <strong>${ownerName}</strong> te reenvió el documento <strong>&ldquo;${tituloEscaped}&rdquo;</strong> para que lo firmes digitalmente.
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
    return { error: "email_failed" };
  }

  const prefix = getPrefix(locale);
  revalidatePath(`${prefix}/dashboard/documentos`);
  return { error: null };
}

// ── Multi-signer upload ──────────────────────────────────────────────────────

export interface FirmanteInput {
  nombre: string;
  correo: string;
  pagina: number;
  campo_x: number;
  campo_y: number;
  campo_ancho: number;
  campo_alto: number;
}

export async function uploadDocumentMultiAction({
  pdfFile,
  locale,
  firmantes,
}: {
  pdfFile: File;
  locale: string;
  firmantes: FirmanteInput[];
}): Promise<{ errorKey: string | null; success: boolean }> {
  if (!pdfFile || pdfFile.size === 0) return { errorKey: "pdf_required", success: false };
  if (!pdfFile.name.toLowerCase().endsWith(".pdf") || pdfFile.type !== "application/pdf")
    return { errorKey: "pdf_invalid", success: false };
  if (pdfFile.size > 20 * 1024 * 1024) return { errorKey: "pdf_too_large", success: false };
  if (!firmantes || firmantes.length === 0) return { errorKey: "min_signers", success: false };
  if (firmantes.length > 5) return { errorKey: "signers_data_invalid", success: false };

  for (const f of firmantes) {
    if (!sanitizeText(f.nombre, 100)) return { errorKey: "name_required", success: false };
    if (!isValidEmail(f.correo.trim().toLowerCase())) return { errorKey: "email_invalid", success: false };
  }
  const correos = firmantes.map(f => f.correo.trim().toLowerCase());
  if (new Set(correos).size !== correos.length) return { errorKey: "email_duplicate", success: false };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`${getPrefix(locale)}/login`);

  const admin = createAdminClient();

  // Plan limit check (same as single-signer)
  let planLimit = 3;
  let subId: string | null = null;
  let subDocsMes = 0;

  const { data: sub, error: subError } = await admin
    .from("suscripciones")
    .select("id, documentos_mes, limite_documentos, estado")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!subError && (sub?.estado === "active" || sub?.estado === "canceling")) {
    planLimit  = sub.limite_documentos;
    subId      = sub.id;
    subDocsMes = sub.documentos_mes ?? 0;
    if (subDocsMes >= planLimit) return { errorKey: "plan_limit_reached", success: false };
  } else {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("documentos")
      .select("id", { count: "exact", head: true })
      .gte("creado_en", startOfMonth.toISOString());
    if ((count ?? 0) >= planLimit) return { errorKey: "plan_limit_reached", success: false };
  }

  const docId = crypto.randomUUID();
  const storagePath = `${user.id}/${docId}.pdf`;
  const titulo = pdfFile.name.replace(/\.pdf$/i, "");
  const primerFirmante = firmantes[0];

  // Upload PDF
  const pdfBuffer = await pdfFile.arrayBuffer();
  const { error: uploadError } = await admin.storage
    .from("pdfs-originales")
    .upload(storagePath, pdfBuffer, { contentType: "application/pdf", upsert: false });
  if (uploadError) return { errorKey: "upload_failed", success: false };

  // Create documento row (backward compat: use first signer for legacy fields)
  const { error: docError } = await supabase
    .from("documentos")
    .insert({
      id: docId,
      owner_id: user.id,
      titulo,
      nombre_destinatario: sanitizeText(primerFirmante.nombre, 100),
      correo_destinatario: primerFirmante.correo.trim().toLowerCase(),
      url_pdf_original: storagePath,
    });

  if (docError) {
    await admin.storage.from("pdfs-originales").remove([storagePath]);
    return { errorKey: "generic", success: false };
  }

  // Create firmantes rows + send emails in parallel
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const ownerName = escapeHtml((user.user_metadata?.nombre as string | undefined) ?? "Alguien");
  const tituloEscaped = escapeHtml(titulo);
  const resend = new Resend(process.env.RESEND_API_KEY);

  await Promise.all(firmantes.map(async (f, orden) => {
    const verificationCode = String(Math.floor(1000 + Math.random() * 9000));
    const nombreFirmante = sanitizeText(f.nombre, 100);
    const correoFirmante = f.correo.trim().toLowerCase();

    // Insert firmante
    const { data: firmante } = await admin.from("firmantes").insert({
      documento_id: docId,
      nombre: nombreFirmante,
      correo: correoFirmante,
      orden: orden + 1,
      codigo_verificacion: verificationCode,
      pagina: f.pagina,
      campo_x: f.campo_x,
      campo_y: f.campo_y,
      campo_ancho: f.campo_ancho,
      campo_alto: f.campo_alto,
    }).select("token").single();

    if (!firmante) return;

    const signingUrl = `${appUrl}/firmar/${firmante.token}`;

    if (process.env.NODE_ENV === "development") {
      console.log(`\n📄 FIRMIU — Firmante ${orden + 1}: ${correoFirmante}`);
      console.log(`   Token:  ${firmante.token}`);
      console.log(`   Código: ${verificationCode}`);
      console.log(`   URL:    ${signingUrl}`);
    }

    try {
      await resend.emails.send({
        from: "Firmiu <noreply@firmiu.com>",
        to: correoFirmante,
        subject: `${ownerName} te envió un documento para firmar`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:0;background:#ffffff">
            <div style="background:#1a3c5e;padding:24px 32px;border-radius:12px 12px 0 0">
              <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px">firmiu</span>
            </div>
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
                Si no esperabas este documento, puedes ignorar este correo.
              </p>
            </div>
          </div>
        `,
      });
    } catch { /* email failed, non-fatal */ }
  }));

  if (subId) {
    await admin
      .from("suscripciones")
      .update({ documentos_mes: subDocsMes + 1, actualizado_en: new Date().toISOString() })
      .eq("id", subId);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/documentos");
  revalidatePath("/en/dashboard");
  revalidatePath("/en/dashboard/documentos");
  return { errorKey: null, success: true };
}

// Reenviar email a firmantes pendientes de un documento multi-firmante
export async function resendFirmantesEmailAction(
  documentoId: string,
  locale: string
): Promise<{ error: string | null }> {
  if (!isValidUUID(documentoId)) return { error: "generic" };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "generic" };

  const { data: doc } = await supabase
    .from("documentos")
    .select("id, titulo, estado")
    .eq("id", documentoId)
    .eq("owner_id", user.id)
    .eq("oculto", false)
    .single();

  if (!doc || doc.estado === "firmado") return { error: "already_signed" };

  const admin = createAdminClient();
  const { data: pendingFirmantes } = await admin
    .from("firmantes")
    .select("token, nombre, correo, codigo_verificacion")
    .eq("documento_id", documentoId)
    .neq("estado", "firmado")
    .eq("oculto", false);

  if (!pendingFirmantes || pendingFirmantes.length === 0) return { error: "already_signed" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const ownerName = escapeHtml((user.user_metadata?.nombre as string | undefined) ?? "Alguien");
  const tituloEscaped = escapeHtml(doc.titulo);
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await Promise.all(pendingFirmantes.map(f =>
      resend.emails.send({
        from: "Firmiu <noreply@firmiu.com>",
        to: f.correo,
        subject: `${ownerName} te reenvió un documento para firmar`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:0;background:#ffffff">
            <div style="background:#1a3c5e;padding:24px 32px;border-radius:12px 12px 0 0">
              <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px">firmiu</span>
            </div>
            <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
              <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Documento pendiente de firma</h2>
              <p style="color:#374151;margin:0 0 24px;line-height:1.6">
                <strong>${ownerName}</strong> te reenvió <strong>&ldquo;${tituloEscaped}&rdquo;</strong>.
              </p>
              <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:20px;text-align:center;margin:0 0 24px">
                <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#f97316">${f.codigo_verificacion}</span>
              </div>
              <a href="${appUrl}/firmar/${f.token}" style="background:#f97316;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;font-size:15px;margin:0 0 24px">
                Firmar documento →
              </a>
              <p style="color:#9ca3af;font-size:12px;margin:0;border-top:1px solid #f3f4f6;padding-top:16px">
                Si no esperabas este documento, puedes ignorar este correo.
              </p>
            </div>
          </div>
        `,
      })
    ));
  } catch {
    return { error: "email_failed" };
  }

  return { error: null };
}

export async function hideDocumentAction(
  id: string,
  locale: string
): Promise<{ error: string | null }> {
  if (!isValidUUID(id)) return { error: "generic" };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "generic" };

  const { error } = await supabase
    .from("documentos")
    .update({ oculto: true })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: "generic" };

  const prefix = locale === "es" ? "" : `/${locale}`;
  revalidatePath(`${prefix}/dashboard/documentos`);
  revalidatePath(`${prefix}/dashboard`);
  return { error: null };
}
