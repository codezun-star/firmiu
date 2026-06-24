"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { escapeHtml, isValidEmail, isValidUUID, sanitizeText } from "@/lib/security";
import { emailShell, codeBox, ctaButton } from "@/lib/email";
import { getPrefix } from "@/lib/utils";

export type DocumentState = {
  errorKey: string | null;
  success: boolean;
  destinatario?: string;
  titulo?: string;
};

/**
 * Verify the file is really a PDF by its magic bytes, not just the extension
 * and MIME type (both client-controlled). The "%PDF-" header must appear at the
 * very start; we scan a small window to tolerate generators that prepend a few
 * bytes.
 */
async function hasPdfMagicBytes(file: File): Promise<boolean> {
  const head = await file.slice(0, 1024).arrayBuffer();
  return Buffer.from(head).includes("%PDF-");
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
  if (!pdfFile.name.toLowerCase().endsWith(".pdf") || pdfFile.type !== "application/pdf") {
    return { errorKey: "pdf_invalid", success: false };
  }
  if (pdfFile.size > 20 * 1024 * 1024) {
    return { errorKey: "pdf_too_large", success: false };
  }
  if (!(await hasPdfMagicBytes(pdfFile))) {
    return { errorKey: "pdf_invalid", success: false };
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
      html: emailShell(`
        <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Tienes un documento para firmar</h2>
        <p style="color:#374151;margin:0 0 24px;line-height:1.6">
          <strong>${ownerName}</strong> te ha enviado el documento <strong>&ldquo;${tituloEscaped}&rdquo;</strong> para que lo firmes digitalmente.
        </p>
        <p style="color:#374151;margin:0 0 8px;font-size:14px;font-weight:600">Tu código de verificación:</p>
        ${codeBox(verificationCode)}
        ${ctaButton(signingUrl, "Firmar documento →")}
        <p style="color:#9ca3af;font-size:12px;margin:0;border-top:1px solid #f3f4f6;padding-top:16px">
          Si no esperabas este documento, puedes ignorar este correo.<br>
          Este enlace es de uso único y expira una vez firmado.
        </p>
      `),
    });
  } catch {
    // Email failed — document is created, signing link remains valid
  }

  // Increment monthly counter for paid plans — atomic RPC avoids lost updates
  // under concurrent uploads (non-fatal if migration not applied)
  if (subId) {
    await admin.rpc("increment_documentos_mes", { p_sub_id: subId });
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

  // Resending gives the signer a fresh chance: clear any brute-force lockout
  await admin
    .from("firmas")
    .update({ intentos_fallidos: 0, bloqueado: false })
    .eq("documento_id", doc.id);

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
      html: emailShell(`
        <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Documento pendiente de firma</h2>
        <p style="color:#374151;margin:0 0 24px;line-height:1.6">
          <strong>${ownerName}</strong> te reenvió el documento <strong>&ldquo;${tituloEscaped}&rdquo;</strong> para que lo firmes digitalmente.
        </p>
        <p style="color:#374151;margin:0 0 8px;font-size:14px;font-weight:600">Tu código de verificación:</p>
        ${codeBox(verificationCode)}
        ${ctaButton(signingUrl, "Firmar documento →")}
        <p style="color:#9ca3af;font-size:12px;margin:0;border-top:1px solid #f3f4f6;padding-top:16px">
          Si no esperabas este documento, puedes ignorar este correo.<br>
          Este enlace es de uso único y expira una vez firmado.
        </p>
      `),
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

export async function uploadDocumentMultiAction(
  formData: FormData
): Promise<{ errorKey: string | null; success: boolean }> {
  const pdfFile = formData.get("pdf") as File | null;
  const locale   = (formData.get("locale") as string) ?? "es";
  const firmantesJson = (formData.get("firmantes") as string) ?? "[]";

  let firmantes: FirmanteInput[];
  try {
    firmantes = JSON.parse(firmantesJson) as FirmanteInput[];
  } catch {
    return { errorKey: "signers_data_invalid", success: false };
  }

  if (!pdfFile || pdfFile.size === 0) return { errorKey: "pdf_required", success: false };
  if (!pdfFile.name.toLowerCase().endsWith(".pdf") || pdfFile.type !== "application/pdf")
    return { errorKey: "pdf_invalid", success: false };
  if (pdfFile.size > 20 * 1024 * 1024) return { errorKey: "pdf_too_large", success: false };
  if (!(await hasPdfMagicBytes(pdfFile))) return { errorKey: "pdf_invalid", success: false };
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
    const { data: firmante, error: insertError } = await admin.from("firmantes").insert({
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

    if (insertError || !firmante) {
      console.error(`[Firmiu] ERROR insert firmante ${orden + 1} (${correoFirmante}):`, insertError?.message ?? "firmante null");
      return;
    }

    const signingUrl = `${appUrl}/firmar/${firmante.token}`;
    console.log(`[Firmiu] Firmante ${orden + 1}: ${correoFirmante} | token: ${firmante.token} | doc: ${docId}`);

    try {
      await resend.emails.send({
        from: "Firmiu <noreply@firmiu.com>",
        to: correoFirmante,
        subject: `${ownerName} te envió un documento para firmar`,
        html: emailShell(`
          <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Tienes un documento para firmar</h2>
          <p style="color:#374151;margin:0 0 24px;line-height:1.6">
            <strong>${ownerName}</strong> te ha enviado el documento <strong>&ldquo;${tituloEscaped}&rdquo;</strong> para que lo firmes digitalmente.
          </p>
          <p style="color:#374151;margin:0 0 8px;font-size:14px;font-weight:600">Tu código de verificación:</p>
          ${codeBox(verificationCode)}
          ${ctaButton(signingUrl, "Firmar documento →")}
          <p style="color:#9ca3af;font-size:12px;margin:0;border-top:1px solid #f3f4f6;padding-top:16px">
            Si no esperabas este documento, puedes ignorar este correo.
          </p>
        `),
      });
      console.log(`[Firmiu] Email enviado a firmante ${orden + 1}: ${correoFirmante} (doc: ${docId})`);
    } catch (err) {
      console.error(`[Firmiu] ERROR email firmante ${orden + 1} (${correoFirmante}):`, err instanceof Error ? err.message : String(err));
    }
  }));

  if (subId) {
    await admin.rpc("increment_documentos_mes", { p_sub_id: subId });
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

  // Resending gives signers a fresh chance: clear any brute-force lockout
  await admin
    .from("firmantes")
    .update({ intentos_fallidos: 0, bloqueado: false })
    .eq("documento_id", documentoId)
    .neq("estado", "firmado");

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
        html: emailShell(`
          <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Documento pendiente de firma</h2>
          <p style="color:#374151;margin:0 0 24px;line-height:1.6">
            <strong>${ownerName}</strong> te reenvió <strong>&ldquo;${tituloEscaped}&rdquo;</strong>.
          </p>
          ${codeBox(String(f.codigo_verificacion ?? ""))}
          ${ctaButton(`${appUrl}/firmar/${f.token}`, "Firmar documento →")}
          <p style="color:#9ca3af;font-size:12px;margin:0;border-top:1px solid #f3f4f6;padding-top:16px">
            Si no esperabas este documento, puedes ignorar este correo.
          </p>
        `),
      })
    ));
  } catch {
    return { error: "email_failed" };
  }

  return { error: null };
}

// Reenviar el correo a UN firmante específico (multi-firmante)
export async function resendFirmanteEmailAction(
  firmanteId: string,
  locale: string
): Promise<{ error: string | null }> {
  if (!isValidUUID(firmanteId)) return { error: "generic" };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "generic" };

  const admin = createAdminClient();
  const { data: firmante } = await admin
    .from("firmantes")
    .select("id, documento_id, nombre, correo, estado, token, codigo_verificacion")
    .eq("id", firmanteId)
    .maybeSingle();

  if (!firmante) return { error: "generic" };
  if (firmante.estado === "firmado") return { error: "already_signed" };

  // Ownership: el documento debe ser del usuario autenticado
  const { data: doc } = await supabase
    .from("documentos")
    .select("id, titulo")
    .eq("id", firmante.documento_id)
    .eq("owner_id", user.id)
    .eq("oculto", false)
    .single();

  if (!doc) return { error: "generic" };

  // Reenviar da una oportunidad limpia: limpia el bloqueo brute-force de este firmante
  await admin
    .from("firmantes")
    .update({ intentos_fallidos: 0, bloqueado: false })
    .eq("id", firmante.id);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const ownerName = escapeHtml((user.user_metadata?.nombre as string | undefined) ?? "Alguien");
  const tituloEscaped = escapeHtml(doc.titulo);
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Firmiu <noreply@firmiu.com>",
      to: firmante.correo,
      subject: `${ownerName} te reenvió un documento para firmar`,
      html: emailShell(`
        <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Documento pendiente de firma</h2>
        <p style="color:#374151;margin:0 0 24px;line-height:1.6">
          <strong>${ownerName}</strong> te reenvió <strong>&ldquo;${tituloEscaped}&rdquo;</strong>.
        </p>
        ${codeBox(String(firmante.codigo_verificacion ?? ""))}
        ${ctaButton(`${appUrl}/firmar/${firmante.token}`, "Firmar documento →")}
        <p style="color:#9ca3af;font-size:12px;margin:0;border-top:1px solid #f3f4f6;padding-top:16px">
          Si no esperabas este documento, puedes ignorar este correo.
        </p>
      `),
    });
  } catch {
    return { error: "email_failed" };
  }

  const prefix = getPrefix(locale);
  revalidatePath(`${prefix}/dashboard/documentos`);
  return { error: null };
}

// Corregir el correo de un firmante (solo si aún no firmó)
export async function updateFirmanteEmailAction(
  firmanteId: string,
  correoRaw: string,
  locale: string
): Promise<{ error: string | null }> {
  if (!isValidUUID(firmanteId)) return { error: "generic" };
  const correo = (correoRaw ?? "").trim().toLowerCase().slice(0, 320);
  if (!isValidEmail(correo)) return { error: "email_invalid" };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "generic" };

  const admin = createAdminClient();
  const { data: firmante } = await admin
    .from("firmantes")
    .select("id, documento_id, estado")
    .eq("id", firmanteId)
    .maybeSingle();

  if (!firmante) return { error: "generic" };
  if (firmante.estado === "firmado") return { error: "already_signed" };

  // Ownership
  const { data: doc } = await supabase
    .from("documentos")
    .select("id")
    .eq("id", firmante.documento_id)
    .eq("owner_id", user.id)
    .eq("oculto", false)
    .single();

  if (!doc) return { error: "generic" };

  const { error } = await admin.from("firmantes").update({ correo }).eq("id", firmanteId);
  if (error) return { error: "generic" };

  const prefix = getPrefix(locale);
  revalidatePath(`${prefix}/dashboard/documentos`);
  return { error: null };
}

// Corregir el correo del destinatario en documentos antiguos (single-signer / tabla firmas)
export async function updateDocumentEmailAction(
  documentoId: string,
  correoRaw: string,
  locale: string
): Promise<{ error: string | null }> {
  if (!isValidUUID(documentoId)) return { error: "generic" };
  const correo = (correoRaw ?? "").trim().toLowerCase().slice(0, 320);
  if (!isValidEmail(correo)) return { error: "email_invalid" };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "generic" };

  const { data: doc } = await supabase
    .from("documentos")
    .select("id, estado")
    .eq("id", documentoId)
    .eq("owner_id", user.id)
    .eq("oculto", false)
    .single();

  if (!doc) return { error: "generic" };
  if (doc.estado === "firmado") return { error: "already_signed" };

  const { error } = await supabase
    .from("documentos")
    .update({ correo_destinatario: correo })
    .eq("id", documentoId)
    .eq("owner_id", user.id);

  if (error) return { error: "generic" };

  const prefix = getPrefix(locale);
  revalidatePath(`${prefix}/dashboard/documentos`);
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
