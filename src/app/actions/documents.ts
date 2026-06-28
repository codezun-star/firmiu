"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { escapeHtml, isValidEmail, isValidUUID, sanitizeText } from "@/lib/security";
import { emailShell, codeBox, ctaButton } from "@/lib/email";
import { getPrefix } from "@/lib/utils";

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

/** Per-plan cap on how many documents can be uploaded in a SINGLE batch. The
 *  monthly quota (suscripciones.limite_documentos) still applies on top of this. */
const BATCH_LIMITS: Record<string, number> = { free: 1, starter: 5, pro: 20, business: 50 };

/** Validate one document's file + signers. Returns an errorKey, or null if OK. */
async function validateDocInput(
  pdfFile: File | null,
  firmantes: FirmanteInput[] | null | undefined
): Promise<string | null> {
  if (!pdfFile || pdfFile.size === 0) return "pdf_required";
  if (!pdfFile.name.toLowerCase().endsWith(".pdf") || pdfFile.type !== "application/pdf") return "pdf_invalid";
  if (pdfFile.size > 20 * 1024 * 1024) return "pdf_too_large";
  if (!(await hasPdfMagicBytes(pdfFile))) return "pdf_invalid";
  if (!firmantes || firmantes.length === 0) return "min_signers";
  if (firmantes.length > 5) return "signers_data_invalid";
  for (const f of firmantes) {
    if (!sanitizeText(f.nombre, 100)) return "name_required";
    if (!isValidEmail(f.correo.trim().toLowerCase())) return "email_invalid";
  }
  const correos = firmantes.map(f => f.correo.trim().toLowerCase());
  if (new Set(correos).size !== correos.length) return "email_duplicate";
  return null;
}

/**
 * Resolve the caller's plan limits in one place (shared by single + batch upload).
 * `remaining` = how many more documents fit in the monthly quota right now.
 * `batchLimit` = max documents allowed in a single upload for the plan.
 */
async function resolvePlanLimits(
  admin: ReturnType<typeof createAdminClient>,
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<{ planKey: string; subId: string | null; remaining: number; batchLimit: number }> {
  const { data: sub, error: subError } = await admin
    .from("suscripciones")
    .select("id, plan, documentos_mes, limite_documentos, estado, periodo_fin")
    .eq("owner_id", userId)
    .maybeSingle();

  // A 'canceling' sub keeps paid access only until periodo_fin — guards revenue
  // if Paddle's subscription.canceled webhook is ever missed at period end.
  const cancelingValid = sub?.estado === "canceling" && (!sub.periodo_fin || new Date(sub.periodo_fin as string) > new Date());
  if (!subError && sub && (sub.estado === "active" || cancelingValid)) {
    const planKey = (sub.plan as string) ?? "free";
    const limit = (sub.limite_documentos as number) ?? 3;
    const used = (sub.documentos_mes as number) ?? 0;
    return {
      planKey,
      subId: sub.id as string,
      remaining: Math.max(0, limit - used),
      batchLimit: BATCH_LIMITS[planKey] ?? 1,
    };
  }

  // Free plan — count actual docs from this calendar month (limit 3)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("documentos")
    .select("id", { count: "exact", head: true })
    .gte("creado_en", startOfMonth.toISOString());
  return {
    planKey: "free",
    subId: null,
    remaining: Math.max(0, 3 - (count ?? 0)),
    batchLimit: BATCH_LIMITS.free,
  };
}

/**
 * Create ONE document: upload the PDF, insert the documento row + N firmantes,
 * and email each signer. Does NOT check plan limits or bump the counter — the
 * caller owns those (so batch uploads count correctly). Returns true on success.
 */
async function createOneDocument(
  admin: ReturnType<typeof createAdminClient>,
  supabase: ReturnType<typeof createClient>,
  userId: string,
  appUrl: string,
  ownerName: string,
  pdfFile: File,
  firmantes: FirmanteInput[],
  modo: "paralelo" | "secuencial" = "paralelo"
): Promise<boolean> {
  const docId = crypto.randomUUID();
  const storagePath = `${userId}/${docId}.pdf`;
  const titulo = pdfFile.name.replace(/\.pdf$/i, "");
  const primerFirmante = firmantes[0];

  // Upload PDF
  const pdfBuffer = await pdfFile.arrayBuffer();
  const { error: uploadError } = await admin.storage
    .from("pdfs-originales")
    .upload(storagePath, pdfBuffer, { contentType: "application/pdf", upsert: false });
  if (uploadError) return false;

  // Create documento row (backward compat: use first signer for legacy fields).
  // modo_firma is set in a separate, non-fatal step so document creation still
  // works if migration 012 hasn't been applied — in that case it degrades to
  // 'paralelo' (everyone is emailed at once).
  const { error: docError } = await supabase
    .from("documentos")
    .insert({
      id: docId,
      owner_id: userId,
      titulo,
      nombre_destinatario: sanitizeText(primerFirmante.nombre, 100),
      correo_destinatario: primerFirmante.correo.trim().toLowerCase(),
      url_pdf_original: storagePath,
    });

  if (docError) {
    await admin.storage.from("pdfs-originales").remove([storagePath]);
    return false;
  }

  let effectiveModo: "paralelo" | "secuencial" = modo;
  if (modo === "secuencial") {
    const { error: modoErr } = await admin.from("documentos").update({ modo_firma: "secuencial" }).eq("id", docId);
    if (modoErr) effectiveModo = "paralelo"; // column missing → fall back, email everyone
  }

  // Create firmantes rows + send emails in parallel.
  // In 'secuencial' mode ALL firmantes are created (so their tokens exist), but
  // only the FIRST one (orden 1) is emailed now; signFirmante emails the next
  // one each time someone signs.
  const tituloEscaped = escapeHtml(titulo);
  const resend = new Resend(process.env.RESEND_API_KEY);

  await Promise.all(firmantes.map(async (f, idx) => {
    const orden = idx + 1;
    const verificationCode = String(Math.floor(1000 + Math.random() * 9000));
    const nombreFirmante = sanitizeText(f.nombre, 100);
    const correoFirmante = f.correo.trim().toLowerCase();

    // Insert firmante
    const { data: firmante, error: insertError } = await admin.from("firmantes").insert({
      documento_id: docId,
      nombre: nombreFirmante,
      correo: correoFirmante,
      orden,
      codigo_verificacion: verificationCode,
      pagina: f.pagina,
      campo_x: f.campo_x,
      campo_y: f.campo_y,
      campo_ancho: f.campo_ancho,
      campo_alto: f.campo_alto,
    }).select("token").single();

    if (insertError || !firmante) {
      console.error(`[Firmiu] ERROR insert firmante ${orden} (${correoFirmante}):`, insertError?.message ?? "firmante null");
      return;
    }

    // Sequential: hold every email except the first signer's.
    if (effectiveModo === "secuencial" && idx !== 0) return;

    const signingUrl = `${appUrl}/firmar/${firmante.token}`;
    console.log(`[Firmiu] Firmante ${orden}: ${correoFirmante} | token: ${firmante.token} | doc: ${docId}`);

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
      console.log(`[Firmiu] Email enviado a firmante ${orden}: ${correoFirmante} (doc: ${docId})`);
    } catch (err) {
      console.error(`[Firmiu] ERROR email firmante ${orden} (${correoFirmante}):`, err instanceof Error ? err.message : String(err));
    }
  }));

  return true;
}

/** Normalize an untrusted string to a valid signing mode. */
function parseModo(raw: unknown): "paralelo" | "secuencial" {
  return raw === "secuencial" ? "secuencial" : "paralelo";
}

export async function uploadDocumentMultiAction(
  formData: FormData
): Promise<{ errorKey: string | null; success: boolean }> {
  const locale = (formData.get("locale") as string) ?? "es";
  const pdfFile = formData.get("pdf") as File | null;

  let firmantes: FirmanteInput[];
  try {
    firmantes = JSON.parse((formData.get("firmantes") as string) ?? "[]") as FirmanteInput[];
  } catch {
    return { errorKey: "signers_data_invalid", success: false };
  }

  const validationError = await validateDocInput(pdfFile, firmantes);
  if (validationError) return { errorKey: validationError, success: false };

  const modo = parseModo(formData.get("modo"));

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`${getPrefix(locale)}/login`);

  const admin = createAdminClient();
  const { subId, remaining } = await resolvePlanLimits(admin, supabase, user.id);
  if (remaining <= 0) return { errorKey: "plan_limit_reached", success: false };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const ownerName = escapeHtml((user.user_metadata?.nombre as string | undefined) ?? "Alguien");

  const ok = await createOneDocument(admin, supabase, user.id, appUrl, ownerName, pdfFile as File, firmantes, modo);
  if (!ok) return { errorKey: "upload_failed", success: false };

  if (subId) await admin.rpc("increment_documentos_mes", { p_sub_id: subId });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/documentos");
  revalidatePath("/en/dashboard");
  revalidatePath("/en/dashboard/documentos");
  return { errorKey: null, success: true };
}

/**
 * Batch upload: several independent documents in one go, each with its own PDF,
 * signers and positions. FormData carries `count` plus `pdf_{i}` / `firmantes_{i}`.
 * Gated by the plan's batch limit AND the remaining monthly quota.
 */
export async function uploadDocumentsBatchAction(
  formData: FormData
): Promise<{ errorKey: string | null; success: boolean; created?: number }> {
  const locale = (formData.get("locale") as string) ?? "es";
  const count = Math.max(0, parseInt((formData.get("count") as string) ?? "0", 10) || 0);
  if (count === 0) return { errorKey: "pdf_required", success: false };

  // Collect every document from the FormData
  const docs: { pdfFile: File | null; firmantes: FirmanteInput[]; modo: "paralelo" | "secuencial" }[] = [];
  for (let i = 0; i < count; i++) {
    const pdfFile = formData.get(`pdf_${i}`) as File | null;
    let firmantes: FirmanteInput[];
    try {
      firmantes = JSON.parse((formData.get(`firmantes_${i}`) as string) ?? "[]") as FirmanteInput[];
    } catch {
      return { errorKey: "signers_data_invalid", success: false };
    }
    docs.push({ pdfFile, firmantes, modo: parseModo(formData.get(`modo_${i}`)) });
  }

  // Validate ALL documents up front — nothing is created if any one is invalid
  for (const d of docs) {
    const err = await validateDocInput(d.pdfFile, d.firmantes);
    if (err) return { errorKey: err, success: false };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`${getPrefix(locale)}/login`);

  const admin = createAdminClient();
  const { subId, remaining, batchLimit } = await resolvePlanLimits(admin, supabase, user.id);

  if (remaining <= 0) return { errorKey: "plan_limit_reached", success: false };
  if (docs.length > batchLimit) return { errorKey: "batch_limit_reached", success: false };
  if (docs.length > remaining) return { errorKey: "plan_limit_reached", success: false };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const ownerName = escapeHtml((user.user_metadata?.nombre as string | undefined) ?? "Alguien");

  // Create sequentially so the monthly counter increments cleanly per document
  let created = 0;
  for (const d of docs) {
    const ok = await createOneDocument(admin, supabase, user.id, appUrl, ownerName, d.pdfFile as File, d.firmantes, d.modo);
    if (ok) {
      created++;
      if (subId) await admin.rpc("increment_documentos_mes", { p_sub_id: subId });
    }
  }

  if (created === 0) return { errorKey: "upload_failed", success: false };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/documentos");
  revalidatePath("/en/dashboard");
  revalidatePath("/en/dashboard/documentos");
  return { errorKey: null, success: true, created };
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
