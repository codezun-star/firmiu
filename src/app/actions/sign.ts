"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { PDFDocument, PDFImage, rgb, StandardFonts } from "pdf-lib";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isValidUUID, isValidVerificationCode, escapeHtml } from "@/lib/security";
import { getPrefix } from "@/lib/utils";

export interface SignResult {
  errorKey: string | null;
  success?: boolean;
  redirectTo?: string;
}

export interface DownloadResult {
  url: string | null;
  errorKey: string | null;
}

interface GeoData {
  city: string;
  regionName: string;
  country: string;
  timezone: string;
  proxy: boolean;
  hosting: boolean;
}

function parseUserAgent(ua: string | null): { browser: string; os: string } {
  if (!ua) return { browser: "Desconocido", os: "Desconocido" };

  let browser = "Otro";
  let os = "Otro";

  // Browser — order matters: Edge before Chrome (Edge UA includes "Chrome")
  if (/Edg\/(\d+)/.test(ua))
    browser = `Edge ${ua.match(/Edg\/(\d+)/)?.[1] ?? ""}`;
  else if (/OPR\/(\d+)/.test(ua))
    browser = `Opera ${ua.match(/OPR\/(\d+)/)?.[1] ?? ""}`;
  else if (/Chrome\/(\d+)/.test(ua))
    browser = `Chrome ${ua.match(/Chrome\/(\d+)/)?.[1] ?? ""}`;
  else if (/Firefox\/(\d+)/.test(ua))
    browser = `Firefox ${ua.match(/Firefox\/(\d+)/)?.[1] ?? ""}`;
  else if (/Version\/(\d+).*Safari/.test(ua))
    browser = `Safari ${ua.match(/Version\/(\d+)/)?.[1] ?? ""}`;

  // OS
  if (/Windows NT 10\.0/.test(ua)) os = "Windows 10/11";
  else if (/Windows NT 6\.3/.test(ua)) os = "Windows 8.1";
  else if (/Windows NT 6\.1/.test(ua)) os = "Windows 7";
  else if (/Mac OS X ([\d_]+)/.test(ua))
    os = `macOS ${ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, ".") ?? ""}`;
  else if (/Android (\d+)/.test(ua))
    os = `Android ${ua.match(/Android (\d+)/)?.[1] ?? ""}`;
  else if (/iPhone|iPad/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";

  return { browser: browser.trim(), os: os.trim() };
}

async function fetchGeoData(ip: string | null): Promise<GeoData | null> {
  if (!ip) return null;
  const isPrivate =
    /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(ip) ||
    ip === "::1" ||
    ip === "localhost";
  if (isPrivate) return null;

  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,city,regionName,timezone,proxy,hosting`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== "success") return null;
    return {
      city: data.city ?? "",
      regionName: data.regionName ?? "",
      country: data.country ?? "",
      timezone: data.timezone ?? "",
      proxy: Boolean(data.proxy),
      hosting: Boolean(data.hosting),
    };
  } catch {
    return null;
  }
}

function truncate(str: string, max = 52): string {
  return str.length > max ? str.slice(0, max - 1) + "..." : str;
}

async function addSignaturePage(
  pdfDoc: PDFDocument,
  pngImage: PDFImage,
  opts: {
    nombre: string;
    correo: string;
    titulo: string;
    ip: string | null;
    now: Date;
    geo: GeoData | null;
    browser: string;
    os: string;
    timezone?: string | null;
  }
): Promise<void> {
  const { nombre, correo, titulo, ip, now, geo, browser, os, timezone } = opts;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Use timezone from geo (most accurate), then browser-supplied, then UTC
  const tz = geo?.timezone || timezone || "UTC";
  const tzShort = tz === "UTC" ? "UTC" : (tz.split("/").pop()?.replace(/_/g, " ") ?? tz);

  const fecha = now.toLocaleDateString("es", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: tz,
  });
  const hora =
    now.toLocaleTimeString("es", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: tz,
    }) + ` (${tzShort})`;

  // Colors
  const darkBlue = rgb(0.102, 0.235, 0.369); // #1a3c5e
  const orange   = rgb(0.976, 0.451, 0.086); // #F97316
  const textGray = rgb(0.216, 0.255, 0.318); // #374151
  const lineGray = rgb(0.85, 0.85, 0.85);

  // Match the original document's page size so all pages look consistent
  const origPages = pdfDoc.getPages();
  const { width: origW, height: origH } = origPages.length > 0
    ? origPages[0].getSize()
    : { width: 595, height: 842 };

  const sigPage = pdfDoc.addPage([origW, origH]);
  const pageW = origW;
  const pageH = origH;
  const margin = 50;
  const contentW = pageW - margin * 2;
  const centerX = pageW / 2;

  // All Y positions are relative to the top of the page (pageH - offsetFromTop)
  const fromTop = (pt: number) => pageH - pt;

  // ── Title block ──────────────────────────────────────────────────────────────
  const titleText = "REGISTRO DE FIRMA DIGITAL";
  const titleSize = 14;
  const titleW = bold.widthOfTextAtSize(titleText, titleSize);
  sigPage.drawText(titleText, {
    x: centerX - titleW / 2,
    y: fromTop(54),
    size: titleSize,
    font: bold,
    color: darkBlue,
  });

  const subText = "firmiu.com";
  const subSize = 9;
  const subW = font.widthOfTextAtSize(subText, subSize);
  sigPage.drawText(subText, {
    x: centerX - subW / 2,
    y: fromTop(72),
    size: subSize,
    font,
    color: darkBlue,
  });

  // ── Signature box (orange border) ────────────────────────────────────────────
  const boxX = margin;
  const boxH = 130;
  const boxW = contentW;
  const boxY = fromTop(223); // box occupies fromTop(93) → fromTop(223)

  sigPage.drawRectangle({
    x: boxX,
    y: boxY,
    width: boxW,
    height: boxH,
    color: rgb(1, 1, 1),
    borderColor: orange,
    borderWidth: 1.5,
  });

  // Center signature image inside the box (max 90% of box, maintaining aspect ratio)
  const maxSigW = boxW - 40;
  const maxSigH = boxH - 20;
  const scale = Math.min(maxSigW / pngImage.width, maxSigH / pngImage.height);
  const sigW = pngImage.width * scale;
  const sigH = pngImage.height * scale;
  sigPage.drawImage(pngImage, {
    x: boxX + (boxW - sigW) / 2,
    y: boxY + (boxH - sigH) / 2,
    width: sigW,
    height: sigH,
    opacity: 0.9,
  });

  // ── Thick separator ──────────────────────────────────────────────────────────
  sigPage.drawLine({
    start: { x: margin, y: fromTop(243) },
    end: { x: margin + contentW, y: fromTop(243) },
    thickness: 2,
    color: darkBlue,
  });

  // ── Audit block title ────────────────────────────────────────────────────────
  const auditTitle = "DOCUMENTO FIRMADO DIGITALMENTE";
  const auditTitleW = bold.widthOfTextAtSize(auditTitle, 8);
  sigPage.drawText(auditTitle, {
    x: centerX - auditTitleW / 2,
    y: fromTop(259),
    size: 8,
    font: bold,
    color: darkBlue,
  });

  sigPage.drawLine({
    start: { x: margin, y: fromTop(269) },
    end: { x: margin + contentW, y: fromTop(269) },
    thickness: 0.4,
    color: lineGray,
  });

  // ── Data rows ────────────────────────────────────────────────────────────────
  type Row = [string, string];
  const rows: Row[] = [
    ["Firmante:", truncate(nombre)],
    ["Correo:", truncate(correo)],
    ["Fecha:", fecha],
    ["Hora:", hora],
    ["IP:", ip ?? "No disponible"],
    ["Dispositivo:", truncate(`${os} - ${browser}`)],
  ];

  if (geo?.city) {
    const locationParts = [geo.city, geo.regionName, geo.country].filter(Boolean);
    rows.push(["Ubicacion:", locationParts.join(", ")]);
  }
  if (geo?.proxy) {
    rows.push(["Red:", "VPN/Proxy detectado (!)"]);
  } else if (geo?.hosting) {
    rows.push(["Red:", "Datacenter/Hosting (!)"]);
  }
  rows.push(["Documento:", truncate(titulo)]);

  const rowSize = 8.5;
  const lineH = 12;
  const labelX = margin + 5;
  const valueX = margin + 95;
  let y = fromTop(281);

  for (const [label, value] of rows) {
    sigPage.drawText(label, { x: labelX, y, size: rowSize, font: bold, color: textGray });
    sigPage.drawText(value, { x: valueX, y, size: rowSize, font, color: textGray });
    y -= lineH;
  }

  y -= 5;
  sigPage.drawLine({
    start: { x: margin, y },
    end: { x: margin + contentW, y },
    thickness: 0.4,
    color: lineGray,
  });
  y -= 12;

  // ── Legal note ───────────────────────────────────────────────────────────────
  sigPage.drawText(
    "Este registro tiene validez legal para contratos privados conforme a las leyes de firma electronica. - firmiu.com",
    { x: labelX, y, size: 6.5, font, color: rgb(0.5, 0.5, 0.5) }
  );
}

// ── signDocumentAction ───────────────────────────────────────────────────────

export async function signDocumentAction({
  token,
  signaturePng,
  code,
  locale,
  userAgent: clientUA = null,
  timezone = null,
}: {
  token: string;
  signaturePng: string;
  code: string;
  locale: string;
  userAgent?: string | null;
  timezone?: string | null;
}): Promise<SignResult> {
  // Guard: reject malformed inputs before touching the database
  if (!isValidUUID(token)) return { errorKey: "not_found" };
  if (!isValidVerificationCode(code)) return { errorKey: "invalid_code" };
  if (
    !signaturePng?.startsWith("data:image/png;base64,") ||
    signaturePng.length > 2_000_000
  ) {
    return { errorKey: "sign_failed" };
  }

  const admin = createAdminClient();
  const now = new Date();

  // 1. Fetch document
  const { data: doc, error: docError } = await admin
    .from("documentos")
    .select("id, owner_id, titulo, nombre_destinatario, correo_destinatario, estado, url_pdf_original, creado_en")
    .eq("token", token)
    .single();

  if (docError || !doc) return { errorKey: "not_found" };
  if (doc.estado === "firmado") return { errorKey: "already_signed" };

  // Token expiration: 30 days after document creation
  const docCreatedAt = new Date(doc.creado_en as string);
  if (now.getTime() - docCreatedAt.getTime() > 30 * 24 * 60 * 60 * 1000) {
    return { errorKey: "not_found" };
  }

  // 2. Validate verification code + brute force protection (single query)
  const { data: firma } = await admin
    .from("firmas")
    .select("id, codigo_verificacion, intentos_fallidos, bloqueado")
    .eq("documento_id", doc.id)
    .single();

  if (!firma) return { errorKey: "not_found" };
  if (firma.bloqueado) return { errorKey: "code_blocked" };

  if (firma.codigo_verificacion !== code) {
    const intentos = (firma.intentos_fallidos ?? 0) + 1;
    await admin
      .from("firmas")
      .update({ intentos_fallidos: intentos, bloqueado: intentos >= 5 })
      .eq("id", firma.id);
    return { errorKey: "invalid_code" };
  }

  // 3. Capture request metadata
  const headersList = headers();
  const rawIp =
    headersList.get("x-forwarded-for") ?? headersList.get("x-real-ip") ?? null;
  const rawIpClean = rawIp?.split(",")[0]?.trim() ?? null;
  const isPrivateIp =
    !rawIpClean ||
    rawIpClean === "::1" ||
    rawIpClean === "::ffff:127.0.0.1" ||
    /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(rawIpClean);
  const ip = isPrivateIp ? null : rawIpClean;
  const uaString = clientUA ?? headersList.get("user-agent") ?? null;
  const { browser, os } = parseUserAgent(uaString);

  // 4. Geo + VPN lookup (non-fatal, 3s timeout)
  const geo = await fetchGeoData(ip);

  // 5. PDF: download → sign → add footer → upload
  const firmadoPath = `${doc.owner_id}/${doc.id}.pdf`;
  try {
    const { data: pdfBlob, error: dlErr } = await admin.storage
      .from("pdfs-originales")
      .download(doc.url_pdf_original);

    if (dlErr || !pdfBlob) return { errorKey: "sign_failed" };

    const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
    const pngBytes = Buffer.from(
      signaturePng.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );
    const pngImage = await pdfDoc.embedPng(pngBytes);

    await addSignaturePage(pdfDoc, pngImage, {
      nombre: doc.nombre_destinatario,
      correo: doc.correo_destinatario,
      titulo: doc.titulo,
      ip,
      now,
      geo,
      browser,
      os,
      timezone,
    });

    const signedBytes = await pdfDoc.save();

    const { error: uploadErr } = await admin.storage
      .from("pdfs-firmados")
      .upload(firmadoPath, signedBytes, { contentType: "application/pdf", upsert: true });

    if (uploadErr) return { errorKey: "sign_failed" };

    const { error: docUpdateErr } = await admin
      .from("documentos")
      .update({ estado: "firmado", url_pdf_firmado: firmadoPath })
      .eq("id", doc.id);

    if (docUpdateErr) return { errorKey: "sign_failed" };

    // Critical firma update (verificado + timestamps)
    await admin
      .from("firmas")
      .update({ verificado: true, firmado_en: now.toISOString(), ip, user_agent: uaString })
      .eq("id", firma.id);
  } catch {
    return { errorKey: "sign_failed" };
  }

  // Non-critical: notify document owner
  try {
    const { data: ownerData } = await admin.auth.admin.getUserById(doc.owner_id);
    if (ownerData?.user?.email) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const prefix = getPrefix(locale);
      const dashboardUrl = `${appUrl}${prefix}/dashboard/documentos`;
      const tituloEscaped = escapeHtml(doc.titulo);
      const firmante = escapeHtml(doc.nombre_destinatario);
      await resend.emails.send({
        from: "Firmiu <noreply@firmiu.com>",
        to: ownerData.user.email,
        subject: `Tu documento "${tituloEscaped}" fue firmado`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:0;background:#ffffff">
            <div style="background:#1a3c5e;padding:24px 32px;border-radius:12px 12px 0 0">
              <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px">firmiu</span>
            </div>
            <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
              <div style="background:#ecfdf5;border:1px solid #d1fae5;border-radius:10px;padding:16px;margin:0 0 24px;display:flex;align-items:center;gap:12px">
                <span style="color:#10b981;font-size:24px">✓</span>
                <span style="color:#065f46;font-weight:600;font-size:15px">Documento firmado exitosamente</span>
              </div>
              <p style="color:#374151;margin:0 0 16px;line-height:1.6">
                <strong>${firmante}</strong> firmó el documento <strong>&ldquo;${tituloEscaped}&rdquo;</strong>.
                El PDF firmado con audit trail completo ya está disponible en tu panel.
              </p>
              <a href="${dashboardUrl}" style="background:#1a3c5e;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;font-size:15px;margin:0 0 24px">
                Ver en el panel →
              </a>
              <p style="color:#9ca3af;font-size:12px;margin:0;border-top:1px solid #f3f4f6;padding-top:16px">
                Firmiu — Firma digital para Latinoamérica · firmiu.com
              </p>
            </div>
          </div>
        `,
      });
    }
  } catch {
    // Non-fatal: signing succeeded, notification is best-effort
  }

  // Non-critical: enrich firma with parsed + geo metadata
  // Wrapped separately so a missing migration column doesn't break the sign flow
  try {
    await admin
      .from("firmas")
      .update({
        navegador: browser,
        sistema_operativo: os,
        ubicacion: geo ? `${geo.city}, ${geo.country}` : null,
        vpn_detectado: geo ? geo.proxy || geo.hosting : false,
        ubicacion_ciudad: geo?.city ?? null,
        ubicacion_pais: geo?.country ?? null,
      })
      .eq("id", firma.id);
  } catch {
    // Migration 002 may not be applied yet — non-fatal
  }

  return { errorKey: null, success: true, redirectTo: `${getPrefix(locale)}/firmar/exito?token=${token}` };
}

// ── downloadSignedPdfAction ──────────────────────────────────────────────────

export async function downloadSignedPdfAction(
  token: string
): Promise<DownloadResult> {
  if (!isValidUUID(token)) return { url: null, errorKey: "not_found" };

  const admin = createAdminClient();

  const { data: doc } = await admin
    .from("documentos")
    .select("url_pdf_firmado, titulo")
    .eq("token", token)
    .single();

  if (!doc?.url_pdf_firmado) return { url: null, errorKey: "not_found" };

  const { data: urlData } = await admin.storage
    .from("pdfs-firmados")
    .createSignedUrl(doc.url_pdf_firmado, 86400); // 24 h

  if (!urlData?.signedUrl) return { url: null, errorKey: "expired" };

  return { url: urlData.signedUrl, errorKey: null };
}


export async function hideSignatureAction(
  id: string,
  locale: string
): Promise<{ error: string | null }> {
  if (!isValidUUID(id)) return { error: "generic" };

  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "generic" };

  // Resolve ownership: firma → documento → owner
  const { data: firma } = await admin
    .from("firmas")
    .select("documento_id")
    .eq("id", id)
    .single();
  if (!firma) return { error: "generic" };

  // RLS on documentos ensures only the owner can read this row
  const { data: doc } = await supabase
    .from("documentos")
    .select("id")
    .eq("id", firma.documento_id)
    .eq("owner_id", user.id)
    .single();
  if (!doc) return { error: "generic" };

  const { error } = await admin
    .from("firmas")
    .update({ oculto: true })
    .eq("id", id);
  if (error) return { error: "generic" };

  const prefix = locale === "es" ? "" : `/${locale}`;
  revalidatePath(`${prefix}/dashboard/firmas`);
  revalidatePath(`${prefix}/dashboard`);
  return { error: null };
}
