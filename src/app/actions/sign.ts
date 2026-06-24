"use server";

import { headers } from "next/headers";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { PDFDocument, PDFPage, PDFImage, rgb, StandardFonts } from "pdf-lib";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isValidUUID, isValidVerificationCode, escapeHtml } from "@/lib/security";
import { emailShell, ctaButtonNavy } from "@/lib/email";
import { getPrefix, safeFilename } from "@/lib/utils";

/** Signing links expire 30 days after the document was created. */
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

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
  if (/Edg\/(\d+)/.test(ua)) browser = `Edge ${ua.match(/Edg\/(\d+)/)?.[1] ?? ""}`;
  else if (/OPR\/(\d+)/.test(ua)) browser = `Opera ${ua.match(/OPR\/(\d+)/)?.[1] ?? ""}`;
  else if (/Chrome\/(\d+)/.test(ua)) browser = `Chrome ${ua.match(/Chrome\/(\d+)/)?.[1] ?? ""}`;
  else if (/Firefox\/(\d+)/.test(ua)) browser = `Firefox ${ua.match(/Firefox\/(\d+)/)?.[1] ?? ""}`;
  else if (/Version\/(\d+).*Safari/.test(ua)) browser = `Safari ${ua.match(/Version\/(\d+)/)?.[1] ?? ""}`;
  if (/Windows NT 10\.0/.test(ua)) os = "Windows 10/11";
  else if (/Windows NT 6\.3/.test(ua)) os = "Windows 8.1";
  else if (/Windows NT 6\.1/.test(ua)) os = "Windows 7";
  else if (/Mac OS X ([\d_]+)/.test(ua)) os = `macOS ${ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, ".") ?? ""}`;
  else if (/Android (\d+)/.test(ua)) os = `Android ${ua.match(/Android (\d+)/)?.[1] ?? ""}`;
  else if (/iPhone|iPad/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";
  return { browser: browser.trim(), os: os.trim() };
}

async function fetchGeoData(ip: string | null): Promise<GeoData | null> {
  if (!ip) return null;
  const isPrivate =
    /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(ip) ||
    ip === "::1" || ip === "localhost";
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
      city: data.city ?? "", regionName: data.regionName ?? "",
      country: data.country ?? "", timezone: data.timezone ?? "",
      proxy: Boolean(data.proxy), hosting: Boolean(data.hosting),
    };
  } catch { return null; }
}

function truncate(str: string, max = 52): string {
  return str.length > max ? str.slice(0, max - 1) + "..." : str;
}

// ── Place signature image on an existing page at relative coordinates ─────────
// Draws ONLY the signature image (transparent PNG) — no colored box or tint — so
// it looks like a real signature on the document, not a UI placeholder. The
// per-signer colors live only in the positioning preview and the certificate.
// The signature is scaled to fit the positioned field, keeping aspect ratio.
function drawSignatureOnPage(
  page: PDFPage,
  pngImage: PDFImage,
  opts: { campo_x: number; campo_y: number; campo_ancho: number; campo_alto: number }
): void {
  const { campo_x, campo_y, campo_ancho, campo_alto } = opts;
  const { width: W, height: H } = page.getSize();
  const x = campo_x * W;
  const fieldH = campo_alto * H;
  const fieldW = campo_ancho * W;
  // pdf-lib Y origin is bottom-left; our coords are top-left
  const y = H - (campo_y + campo_alto) * H;

  const pad = 2;
  const maxW = fieldW - pad * 2;
  const maxH = fieldH - pad * 2;
  const scale = Math.min(maxW / pngImage.width, maxH / pngImage.height);
  const sigW = pngImage.width * scale;
  const sigH = pngImage.height * scale;

  page.drawImage(pngImage, {
    x: x + (fieldW - sigW) / 2,
    y: y + (fieldH - sigH) / 2,
    width: sigW,
    height: sigH,
  });
}

// ── Audit-trail page labels (the page is PDF content, not UI, so the strings
//    live here rather than in messages/*.json) ─────────────────────────────────
const AUDIT_LABELS = {
  es: {
    title: "REGISTRO DE FIRMA DIGITAL",
    certTitle: "CERTIFICADO DE FIRMA DIGITAL",
    completedOn: "Completado el",
    signersWord: "firmantes",
    signerWord: "firmante",
    integrity: "INTEGRIDAD DEL DOCUMENTO",
    fingerprint: "Huella SHA-256:",
    folio: "Folio:",
    auditTitle: "DOCUMENTO FIRMADO DIGITALMENTE",
    firmante: "Firmante:", correo: "Correo:", fecha: "Fecha:", hora: "Hora:",
    ip: "IP:", dispositivo: "Dispositivo:", ubicacion: "Ubicacion:",
    red: "Red:", documento: "Documento:",
    noDisponible: "No disponible",
    vpn: "VPN/Proxy detectado (!)", hosting: "Datacenter/Hosting (!)",
    legal: "Este registro tiene validez legal para contratos privados conforme a las leyes de firma electronica. - firmiu.com",
  },
  en: {
    title: "DIGITAL SIGNATURE RECORD",
    certTitle: "DIGITAL SIGNATURE CERTIFICATE",
    completedOn: "Completed on",
    signersWord: "signers",
    signerWord: "signer",
    integrity: "DOCUMENT INTEGRITY",
    fingerprint: "SHA-256 fingerprint:",
    folio: "Reference:",
    auditTitle: "DIGITALLY SIGNED DOCUMENT",
    firmante: "Signer:", correo: "Email:", fecha: "Date:", hora: "Time:",
    ip: "IP:", dispositivo: "Device:", ubicacion: "Location:",
    red: "Network:", documento: "Document:",
    noDisponible: "Not available",
    vpn: "VPN/Proxy detected (!)", hosting: "Datacenter/Hosting (!)",
    legal: "This record is legally valid for private contracts under electronic-signature laws. - firmiu.com",
  },
} as const;

// ── Append audit trail page ──────────────────────────────────────────────────
async function addSignaturePage(
  pdfDoc: PDFDocument,
  pngImage: PDFImage,
  opts: {
    nombre: string; correo: string; titulo: string;
    ip: string | null; now: Date; geo: GeoData | null;
    browser: string; os: string; timezone?: string | null; locale?: string;
  }
): Promise<void> {
  const { nombre, correo, titulo, ip, now, geo, browser, os, timezone, locale } = opts;
  const L = locale === "en" ? AUDIT_LABELS.en : AUDIT_LABELS.es;
  const intlLocale = locale === "en" ? "en" : "es";
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const tz = geo?.timezone || timezone || "UTC";
  const tzShort = tz === "UTC" ? "UTC" : (tz.split("/").pop()?.replace(/_/g, " ") ?? tz);
  const fecha = now.toLocaleDateString(intlLocale, { year: "numeric", month: "long", day: "numeric", timeZone: tz });
  const hora = now.toLocaleTimeString(intlLocale, { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: tz }) + ` (${tzShort})`;

  const darkBlue = rgb(0.102, 0.235, 0.369);
  const orange   = rgb(0.976, 0.451, 0.086);
  const textGray = rgb(0.216, 0.255, 0.318);
  const lineGray = rgb(0.85, 0.85, 0.85);

  const origPages = pdfDoc.getPages();
  const { width: origW, height: origH } = origPages.length > 0
    ? origPages[0].getSize() : { width: 595, height: 842 };

  const sigPage = pdfDoc.addPage([origW, origH]);
  const pageW = origW;
  const pageH = origH;
  const margin = 50;
  const contentW = pageW - margin * 2;
  const centerX = pageW / 2;
  const fromTop = (pt: number) => pageH - pt;

  const titleText = L.title;
  const titleSize = 14;
  const titleW = bold.widthOfTextAtSize(titleText, titleSize);
  sigPage.drawText(titleText, { x: centerX - titleW / 2, y: fromTop(54), size: titleSize, font: bold, color: darkBlue });

  const subText = "firmiu.com";
  const subSize = 9;
  const subW = font.widthOfTextAtSize(subText, subSize);
  sigPage.drawText(subText, { x: centerX - subW / 2, y: fromTop(72), size: subSize, font, color: darkBlue });

  const boxX = margin;
  const boxH = 130;
  const boxW = contentW;
  const boxY = fromTop(223);
  sigPage.drawRectangle({ x: boxX, y: boxY, width: boxW, height: boxH, color: rgb(1, 1, 1), borderColor: orange, borderWidth: 1.5 });

  const maxSigW = boxW - 40;
  const maxSigH = boxH - 20;
  const scale = Math.min(maxSigW / pngImage.width, maxSigH / pngImage.height);
  const sigW = pngImage.width * scale;
  const sigH = pngImage.height * scale;
  sigPage.drawImage(pngImage, { x: boxX + (boxW - sigW) / 2, y: boxY + (boxH - sigH) / 2, width: sigW, height: sigH, opacity: 0.9 });

  sigPage.drawLine({ start: { x: margin, y: fromTop(243) }, end: { x: margin + contentW, y: fromTop(243) }, thickness: 2, color: darkBlue });

  const auditTitle = L.auditTitle;
  const auditTitleW = bold.widthOfTextAtSize(auditTitle, 8);
  sigPage.drawText(auditTitle, { x: centerX - auditTitleW / 2, y: fromTop(259), size: 8, font: bold, color: darkBlue });

  sigPage.drawLine({ start: { x: margin, y: fromTop(269) }, end: { x: margin + contentW, y: fromTop(269) }, thickness: 0.4, color: lineGray });

  type Row = [string, string];
  const rows: Row[] = [
    [L.firmante, truncate(nombre)],
    [L.correo, truncate(correo)],
    [L.fecha, fecha],
    [L.hora, hora],
    [L.ip, ip ?? L.noDisponible],
    [L.dispositivo, truncate(`${os} - ${browser}`)],
  ];
  if (geo?.city) rows.push([L.ubicacion, [geo.city, geo.regionName, geo.country].filter(Boolean).join(", ")]);
  if (geo?.proxy) rows.push([L.red, L.vpn]);
  else if (geo?.hosting) rows.push([L.red, L.hosting]);
  rows.push([L.documento, truncate(titulo)]);

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
  sigPage.drawLine({ start: { x: margin, y }, end: { x: margin + contentW, y }, thickness: 0.4, color: lineGray });
  y -= 12;
  sigPage.drawText(
    L.legal,
    { x: labelX, y, size: 6.5, font, color: rgb(0.5, 0.5, 0.5) }
  );
}

// ── Consolidated signature certificate (multi-signer) ────────────────────────
// One page listing every signer IN ORDER with a signature thumbnail + audit
// data. Replaces the per-signer audit page (which produced N pages in signing
// order, each repeating a large signature).
interface CertSigner {
  orden: number;
  nombre: string;
  correo: string;
  firmadoEn: Date;
  ip: string | null;
  dispositivo: string;
  ubicacion: string | null;
  vpn: boolean;
  firmaPng: string | null;
  timezone: string | null;
}

const SIGNER_BORDER_COLORS = [
  rgb(0.102, 0.235, 0.369), // #1a3c5e
  rgb(0.976, 0.451, 0.086), // #F97316
  rgb(0.063, 0.725, 0.506), // #10B981
  rgb(0.545, 0.361, 0.976), // #8B5CF6
  rgb(0.937, 0.267, 0.267), // #EF4444
];

function titleCase(name: string): string {
  return name.replace(/\S+/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

async function addCertificatePage(
  pdfDoc: PDFDocument,
  signers: CertSigner[],
  opts: { titulo: string; completedAt: Date; hash: string; folio: string; locale?: string }
): Promise<void> {
  const { titulo, completedAt, hash, folio, locale } = opts;
  const L = locale === "en" ? AUDIT_LABELS.en : AUDIT_LABELS.es;
  const intlLocale = locale === "en" ? "en" : "es";
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const darkBlue = rgb(0.102, 0.235, 0.369);
  const textGray = rgb(0.216, 0.255, 0.318);
  const softGray = rgb(0.42, 0.45, 0.5);

  const origPages = pdfDoc.getPages();
  const { width: pageW, height: pageH } = origPages.length > 0
    ? origPages[0].getSize() : { width: 595, height: 842 };

  const page = pdfDoc.addPage([pageW, pageH]);
  const margin = 50;
  const contentW = pageW - margin * 2;
  const centerX = pageW / 2;
  const fromTop = (pt: number) => pageH - pt;

  const drawCentered = (text: string, y: number, size: number, f = font, color = textGray) => {
    const w = f.widthOfTextAtSize(text, size);
    page.drawText(text, { x: centerX - w / 2, y, size, font: f, color });
  };

  // ── Header + completion summary ──
  drawCentered(L.certTitle, fromTop(50), 15, bold, darkBlue);
  drawCentered("firmiu.com", fromTop(66), 9, font, darkBlue);
  drawCentered(`${L.documento} ${truncate(titulo, 56)}`, fromTop(86), 9, font, textGray);

  const tz0 = signers[0]?.timezone || "UTC";
  const completedStr = completedAt.toLocaleDateString(intlLocale, { year: "numeric", month: "long", day: "numeric", timeZone: tz0 });
  const word = signers.length === 1 ? L.signerWord : L.signersWord;
  drawCentered(`${L.completedOn} ${completedStr} · ${signers.length} ${word}`, fromTop(101), 8.5, font, softGray);

  page.drawLine({ start: { x: margin, y: fromTop(113) }, end: { x: margin + contentW, y: fromTop(113) }, thickness: 1.5, color: darkBlue });

  // ── Integrity box (anchored above the footer) ──
  const boxH = hash ? 62 : 46;
  const boxBottom = 46;
  const boxTop = boxBottom + boxH;
  page.drawRectangle({ x: margin, y: boxBottom, width: contentW, height: boxH, color: rgb(0.97, 0.98, 0.99), borderColor: rgb(0.8, 0.85, 0.9), borderWidth: 0.8 });
  let iy = boxTop - 16;
  page.drawText(L.integrity, { x: margin + 12, y: iy, size: 8, font: bold, color: darkBlue });
  iy -= 15;
  if (hash) {
    page.drawText(L.fingerprint, { x: margin + 12, y: iy, size: 7.5, font: bold, color: textGray });
    page.drawText(hash, { x: margin + 12 + bold.widthOfTextAtSize(L.fingerprint, 7.5) + 4, y: iy, size: 7, font, color: textGray });
    iy -= 14;
  }
  page.drawText(L.folio, { x: margin + 12, y: iy, size: 7.5, font: bold, color: textGray });
  page.drawText(folio, { x: margin + 12 + bold.widthOfTextAtSize(L.folio, 7.5) + 4, y: iy, size: 7, font, color: textGray });

  // ── Signer cards (centered between the header and the integrity box) ──
  const regionTopY = fromTop(125);
  const regionBottomY = boxTop + 14;
  const regionH = regionTopY - regionBottomY;
  const gap = 10;
  const cardH = Math.min(150, regionH / signers.length);
  const groupH = cardH * signers.length;
  const firstTopY = regionTopY - Math.max(0, (regionH - groupH) / 2);

  for (let i = 0; i < signers.length; i++) {
    const s = signers[i];
    const color = SIGNER_BORDER_COLORS[(s.orden - 1) % SIGNER_BORDER_COLORS.length] ?? darkBlue;
    const cardTop = firstTopY - i * cardH;
    const cardEffH = cardH - gap;
    const cardBottom = cardTop - cardEffH;

    page.drawRectangle({ x: margin, y: cardBottom, width: contentW, height: cardEffH, color: rgb(0.992, 0.995, 1), borderColor: color, borderWidth: 1 });

    // Signature thumbnail (right)
    const thumbW = 140;
    const thumbH = Math.min(52, cardEffH - 16);
    const thumbX = margin + contentW - thumbW - 10;
    const thumbY = cardTop - thumbH - 10;
    page.drawRectangle({ x: thumbX, y: thumbY, width: thumbW, height: thumbH, color: rgb(1, 1, 1), borderColor: rgb(0.88, 0.9, 0.92), borderWidth: 0.6 });
    if (s.firmaPng) {
      try {
        const bytes = Buffer.from(s.firmaPng.replace(/^data:image\/png;base64,/, ""), "base64");
        const img = await pdfDoc.embedPng(bytes);
        const padX = 8, padY = 6;
        const maxW = thumbW - padX * 2, maxH = thumbH - padY * 2;
        const sc = Math.min(maxW / img.width, maxH / img.height);
        const w = img.width * sc, h = img.height * sc;
        page.drawImage(img, { x: thumbX + padX + (maxW - w) / 2, y: thumbY + padY + (maxH - h) / 2, width: w, height: h, opacity: 0.92 });
      } catch { /* skip thumbnail if image is bad */ }
    }

    // Text (left)
    const lx = margin + 12;
    page.drawText(`${s.orden} · ${truncate(titleCase(s.nombre), 32)}`, { x: lx, y: cardTop - 18, size: 11, font: bold, color: darkBlue });

    const stz = s.timezone || "UTC";
    const tzShort = stz === "UTC" ? "UTC" : (stz.split("/").pop()?.replace(/_/g, " ") ?? stz);
    const fecha = s.firmadoEn.toLocaleDateString(intlLocale, { year: "numeric", month: "long", day: "numeric", timeZone: stz });
    const hora = s.firmadoEn.toLocaleTimeString(intlLocale, { hour: "2-digit", minute: "2-digit", timeZone: stz }) + ` (${tzShort})`;

    const rows: Array<[string, string]> = [
      [L.correo, truncate(s.correo, 38)],
      [L.fecha, `${fecha} · ${hora}`],
      [L.ip, s.ip ?? L.noDisponible],
      [L.dispositivo, truncate(s.dispositivo, 36)],
    ];
    if (s.ubicacion) rows.push([L.ubicacion, truncate(s.ubicacion, 38)]);
    if (s.vpn) rows.push([L.red, L.vpn]);

    let ly = cardTop - 34;
    for (const [lab, val] of rows) {
      page.drawText(lab, { x: lx, y: ly, size: 8, font: bold, color: textGray });
      page.drawText(val, { x: lx + 72, y: ly, size: 8, font, color: textGray });
      ly -= 11.5;
    }
  }

  // ── Footer ──
  page.drawText(L.legal, { x: margin + 4, y: 30, size: 6.5, font, color: rgb(0.55, 0.55, 0.55) });
}

// ── Helper: get request IP ───────────────────────────────────────────────────
function getRequestIp(): string | null {
  const h = headers();
  const raw = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? null;
  const clean = raw?.split(",")[0]?.trim() ?? null;
  const isPrivate =
    !clean || clean === "::1" || clean === "::ffff:127.0.0.1" ||
    /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(clean);
  return isPrivate ? null : clean;
}

// ── signDocumentAction ───────────────────────────────────────────────────────
// Handles both: firmantes.token (new multi-signer flow) and documentos.token (legacy)

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
  if (!isValidUUID(token)) return { errorKey: "not_found" };
  if (!isValidVerificationCode(code)) return { errorKey: "invalid_code" };
  if (!signaturePng?.startsWith("data:image/png;base64,") || signaturePng.length > 2_000_000)
    return { errorKey: "sign_failed" };

  const admin = createAdminClient();
  const now = new Date();

  // Try new firmantes flow first
  const { data: firmante } = await admin
    .from("firmantes")
    .select("id, documento_id, nombre, correo, orden, estado, pagina, campo_x, campo_y, campo_ancho, campo_alto, codigo_verificacion, intentos_fallidos, bloqueado")
    .eq("token", token)
    .maybeSingle();

  if (firmante) {
    return signFirmante({
      firmante, token, signaturePng, code, locale, clientUA, timezone, admin, now
    });
  }

  // Legacy flow: look up documentos.token
  return signLegacy({ token, signaturePng, code, locale, clientUA, timezone, admin, now });
}

interface FirmanteRow {
  id: string;
  documento_id: string;
  nombre: string;
  correo: string;
  orden: number | null;
  estado: string;
  pagina: number;
  campo_x: number;
  campo_y: number;
  campo_ancho: number;
  campo_alto: number;
  codigo_verificacion: string | null;
  intentos_fallidos: number;
  bloqueado: boolean;
}

// ── New multi-signer flow ────────────────────────────────────────────────────
async function signFirmante({
  firmante, token, signaturePng, code, locale, clientUA, timezone, admin, now,
}: {
  firmante: FirmanteRow;
  token: string;
  signaturePng: string;
  code: string;
  locale: string;
  clientUA: string | null;
  timezone: string | null;
  admin: ReturnType<typeof import("@/lib/supabase/admin").createAdminClient>;
  now: Date;
}): Promise<SignResult> {
  if (firmante.estado === "firmado") return { errorKey: "already_signed" };
  if (firmante.bloqueado) return { errorKey: "code_blocked" };

  if (firmante.codigo_verificacion !== code) {
    const intentos = (firmante.intentos_fallidos ?? 0) + 1;
    await admin.from("firmantes").update({ intentos_fallidos: intentos, bloqueado: intentos >= 5 }).eq("id", firmante.id);
    return { errorKey: "invalid_code" };
  }

  // Fetch parent document
  const { data: doc } = await admin
    .from("documentos")
    .select("id, owner_id, titulo, url_pdf_original, url_pdf_firmado, creado_en")
    .eq("id", firmante.documento_id)
    .single();

  if (!doc) return { errorKey: "not_found" };

  // Token expiration: 30 days
  const createdAt = new Date(doc.creado_en as string);
  if (now.getTime() - createdAt.getTime() > TOKEN_TTL_MS)
    return { errorKey: "not_found" };

  const ip = getRequestIp();
  const uaString = clientUA ?? headers().get("user-agent") ?? null;
  const { browser, os } = parseUserAgent(uaString);
  const geo = await fetchGeoData(ip);

  const firmadoPath = `${doc.owner_id}/${doc.id}.pdf`;
  const localeTz = geo?.timezone || timezone || null;

  try {
    // Download current PDF: use already-signed version if another signer went first
    const sourceBucket = doc.url_pdf_firmado ? "pdfs-firmados" : "pdfs-originales";
    const sourcePath   = doc.url_pdf_firmado ?? doc.url_pdf_original;
    const { data: pdfBlob, error: dlErr } = await admin.storage.from(sourceBucket).download(sourcePath);
    if (dlErr || !pdfBlob) return { errorKey: "sign_failed" };

    const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
    const pngBytes = Buffer.from(signaturePng.replace(/^data:image\/png;base64,/, ""), "base64");
    const pngImage = await pdfDoc.embedPng(pngBytes);

    // 1. Place this signer's signature at their positioned field
    const pages = pdfDoc.getPages();
    const pageIndex = Math.max(0, Math.min(firmante.pagina - 1, pages.length - 1));
    drawSignatureOnPage(pages[pageIndex], pngImage, {
      campo_x: firmante.campo_x,
      campo_y: firmante.campo_y,
      campo_ancho: firmante.campo_ancho,
      campo_alto: firmante.campo_alto,
    });

    // 2. Are all OTHER signers already done? (this one isn't marked yet)
    //    NOTE: requires migration 011 (firma_imagen, firma_timezone). If those
    //    columns are missing the query errors — fail loudly instead of building
    //    a wrong certificate.
    const { data: others, error: othersErr } = await admin
      .from("firmantes")
      .select("orden, nombre, correo, estado, firmado_en, ip, navegador, sistema_operativo, ubicacion, vpn_detectado, firma_imagen, firma_timezone")
      .eq("documento_id", doc.id)
      .eq("oculto", false)
      .neq("id", firmante.id);

    if (othersErr) return { errorKey: "sign_failed" };

    // Empty (single signer) → [].every() === true → allSigned. Correct.
    const allSigned = (others ?? []).every(o => o.estado === "firmado");

    // 3. On the FINAL signature, append ONE certificate page with every signer
    //    in order (signature thumbnail + audit data). Replaces the old
    //    per-signer audit page (N pages in signing-time order).
    if (allSigned) {
      const signers: CertSigner[] = [
        ...(others ?? []).map(o => ({
          orden:      (o.orden as number | null) ?? 1,
          nombre:     o.nombre as string,
          correo:     o.correo as string,
          firmadoEn:  o.firmado_en ? new Date(o.firmado_en as string) : now,
          ip:         (o.ip as string | null) ?? null,
          dispositivo: `${o.sistema_operativo ?? "?"} - ${o.navegador ?? "?"}`,
          ubicacion:  (o.ubicacion as string | null) ?? null,
          vpn:        Boolean(o.vpn_detectado),
          firmaPng:   (o.firma_imagen as string | null) ?? null,
          timezone:   (o.firma_timezone as string | null) ?? null,
        })),
        {
          orden:      firmante.orden ?? 1,
          nombre:     firmante.nombre,
          correo:     firmante.correo,
          firmadoEn:  now,
          ip,
          dispositivo: `${os} - ${browser}`,
          ubicacion:  geo ? `${geo.city}, ${geo.country}` : null,
          vpn:        geo ? geo.proxy || geo.hosting : false,
          firmaPng:   signaturePng,
          timezone:   localeTz,
        },
      ].sort((a, b) => a.orden - b.orden);

      // Document fingerprint: SHA-256 of the ORIGINAL uploaded PDF. Proves the
      // signed content matches exactly what was sent. Non-fatal if it fails.
      let docHash = "";
      try {
        const { data: origBlob } = await admin.storage.from("pdfs-originales").download(doc.url_pdf_original);
        if (origBlob) docHash = crypto.createHash("sha256").update(Buffer.from(await origBlob.arrayBuffer())).digest("hex");
      } catch { /* non-fatal */ }

      await addCertificatePage(pdfDoc, signers, {
        titulo: doc.titulo, completedAt: now, hash: docHash, folio: doc.id, locale,
      });
    }

    const signedBytes = await pdfDoc.save();

    const { error: uploadErr } = await admin.storage
      .from("pdfs-firmados")
      .upload(firmadoPath, signedBytes, { contentType: "application/pdf", upsert: true });
    if (uploadErr) return { errorKey: "sign_failed" };

    // 4. Mark this firmante as signed (store signature image + timezone so the
    //    certificate can be rebuilt with every signer's thumbnail)
    await admin.from("firmantes").update({
      estado: "firmado",
      firmado_en: now.toISOString(),
      ip, user_agent: uaString,
      navegador: browser, sistema_operativo: os,
      ubicacion: geo ? `${geo.city}, ${geo.country}` : null,
      vpn_detectado: geo ? geo.proxy || geo.hosting : false,
      ubicacion_ciudad: geo?.city ?? null,
      ubicacion_pais: geo?.country ?? null,
      firma_imagen: signaturePng,
      firma_timezone: localeTz,
    }).eq("id", firmante.id);

    // 5. Update documento: signed path + estado (firmado when all done, else visto)
    await admin.from("documentos")
      .update({ url_pdf_firmado: firmadoPath, estado: allSigned ? "firmado" : "visto" })
      .eq("id", doc.id);

    if (allSigned) {
      // Notify owner only when all have signed
      try {
        const { data: ownerData } = await admin.auth.admin.getUserById(doc.owner_id);
        if (ownerData?.user?.email) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
          const prefix = getPrefix(locale);
          const tituloEscaped = escapeHtml(doc.titulo);
          await resend.emails.send({
            from: "Firmiu <noreply@firmiu.com>",
            to: ownerData.user.email,
            subject: `Tu documento "${tituloEscaped}" fue firmado por todos`,
            html: emailShell(`
              <div style="background:#ecfdf5;border:1px solid #d1fae5;border-radius:10px;padding:16px;margin:0 0 24px">
                <span style="color:#10b981;font-weight:600;font-size:15px">✓ Todos los firmantes han firmado</span>
              </div>
              <p style="color:#374151;margin:0 0 16px;line-height:1.6">
                El documento <strong>&ldquo;${tituloEscaped}&rdquo;</strong> fue firmado por todos los destinatarios.
                El PDF final con audit trail ya está disponible.
              </p>
              ${ctaButtonNavy(`${appUrl}${prefix}/dashboard/documentos`, "Descargar en el panel →")}
              <p style="color:#9ca3af;font-size:12px;margin:0;border-top:1px solid #f3f4f6;padding-top:16px">
                Firmiu — Firma digital para Latinoamérica · firmiu.com
              </p>
            `),
          });
        }
      } catch { /* non-fatal */ }
    }
  } catch {
    return { errorKey: "sign_failed" };
  }

  return { errorKey: null, success: true, redirectTo: `${getPrefix(locale)}/firmar/exito?token=${token}` };
}

// ── Legacy single-signer flow (documentos.token + firmas) ────────────────────
async function signLegacy({
  token, signaturePng, code, locale, clientUA, timezone, admin, now,
}: {
  token: string; signaturePng: string; code: string; locale: string;
  clientUA: string | null; timezone: string | null;
  admin: ReturnType<typeof import("@/lib/supabase/admin").createAdminClient>; now: Date;
}): Promise<SignResult> {
  const { data: doc, error: docError } = await admin
    .from("documentos")
    .select("id, owner_id, titulo, nombre_destinatario, correo_destinatario, estado, url_pdf_original, creado_en")
    .eq("token", token)
    .single();

  if (docError || !doc) return { errorKey: "not_found" };
  if (doc.estado === "firmado") return { errorKey: "already_signed" };

  const docCreatedAt = new Date(doc.creado_en as string);
  if (now.getTime() - docCreatedAt.getTime() > TOKEN_TTL_MS)
    return { errorKey: "not_found" };

  const { data: firma } = await admin
    .from("firmas")
    .select("id, codigo_verificacion, intentos_fallidos, bloqueado")
    .eq("documento_id", doc.id)
    .single();

  if (!firma) return { errorKey: "not_found" };
  if (firma.bloqueado) return { errorKey: "code_blocked" };

  if (firma.codigo_verificacion !== code) {
    const intentos = (firma.intentos_fallidos ?? 0) + 1;
    await admin.from("firmas").update({ intentos_fallidos: intentos, bloqueado: intentos >= 5 }).eq("id", firma.id);
    return { errorKey: "invalid_code" };
  }

  const ip = getRequestIp();
  const uaString = clientUA ?? headers().get("user-agent") ?? null;
  const { browser, os } = parseUserAgent(uaString);
  const geo = await fetchGeoData(ip);

  const firmadoPath = `${doc.owner_id}/${doc.id}.pdf`;
  try {
    const { data: pdfBlob, error: dlErr } = await admin.storage.from("pdfs-originales").download(doc.url_pdf_original);
    if (dlErr || !pdfBlob) return { errorKey: "sign_failed" };

    const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
    const pngBytes = Buffer.from(signaturePng.replace(/^data:image\/png;base64,/, ""), "base64");
    const pngImage = await pdfDoc.embedPng(pngBytes);

    await addSignaturePage(pdfDoc, pngImage, {
      nombre: doc.nombre_destinatario, correo: doc.correo_destinatario,
      titulo: doc.titulo, ip, now, geo, browser, os, timezone, locale,
    });

    const signedBytes = await pdfDoc.save();
    const { error: uploadErr } = await admin.storage
      .from("pdfs-firmados")
      .upload(firmadoPath, signedBytes, { contentType: "application/pdf", upsert: true });
    if (uploadErr) return { errorKey: "sign_failed" };

    await admin.from("documentos").update({ estado: "firmado", url_pdf_firmado: firmadoPath }).eq("id", doc.id);
    await admin.from("firmas").update({ verificado: true, firmado_en: now.toISOString(), ip, user_agent: uaString }).eq("id", firma.id);
  } catch {
    return { errorKey: "sign_failed" };
  }

  try {
    const { data: ownerData } = await admin.auth.admin.getUserById(doc.owner_id);
    if (ownerData?.user?.email) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const prefix = getPrefix(locale);
      const tituloEscaped = escapeHtml(doc.titulo);
      const firmante = escapeHtml(doc.nombre_destinatario);
      await resend.emails.send({
        from: "Firmiu <noreply@firmiu.com>",
        to: ownerData.user.email,
        subject: `Tu documento "${tituloEscaped}" fue firmado`,
        html: emailShell(`
          <div style="background:#ecfdf5;border:1px solid #d1fae5;border-radius:10px;padding:16px;margin:0 0 24px">
            <span style="color:#10b981;font-weight:600;font-size:15px">✓ Documento firmado exitosamente</span>
          </div>
          <p style="color:#374151;margin:0 0 16px;line-height:1.6">
            <strong>${firmante}</strong> firmó el documento <strong>&ldquo;${tituloEscaped}&rdquo;</strong>.
          </p>
          ${ctaButtonNavy(`${appUrl}${prefix}/dashboard/documentos`, "Ver en el panel →")}
          <p style="color:#9ca3af;font-size:12px;margin:0;border-top:1px solid #f3f4f6;padding-top:16px">
            Firmiu — firmiu.com
          </p>
        `),
      });
    }
  } catch { /* non-fatal */ }

  try {
    await admin.from("firmas").update({
      navegador: browser, sistema_operativo: os,
      ubicacion: geo ? `${geo.city}, ${geo.country}` : null,
      vpn_detectado: geo ? geo.proxy || geo.hosting : false,
      ubicacion_ciudad: geo?.city ?? null, ubicacion_pais: geo?.country ?? null,
    }).eq("id", firma.id);
  } catch { /* migration may not be applied */ }

  return { errorKey: null, success: true, redirectTo: `${getPrefix(locale)}/firmar/exito?token=${token}` };
}

// ── downloadSignedPdfAction ──────────────────────────────────────────────────
// Handles both firmantes.token and documentos.token

export async function downloadSignedPdfAction(token: string): Promise<DownloadResult> {
  if (!isValidUUID(token)) return { url: null, errorKey: "not_found" };

  const admin = createAdminClient();

  // Try firmante token first
  const { data: firmante } = await admin
    .from("firmantes")
    .select("documento_id")
    .eq("token", token)
    .maybeSingle();

  let docId: string | null = null;

  if (firmante) {
    docId = firmante.documento_id;
  } else {
    const { data: doc } = await admin
      .from("documentos")
      .select("id")
      .eq("token", token)
      .maybeSingle();
    docId = doc?.id ?? null;
  }

  if (!docId) return { url: null, errorKey: "not_found" };

  const { data: doc } = await admin
    .from("documentos")
    .select("titulo, url_pdf_firmado, estado")
    .eq("id", docId)
    .single();

  if (!doc?.url_pdf_firmado || doc.estado !== "firmado")
    return { url: null, errorKey: "not_found" };

  // Force the download to use the original document title, not the UUID storage path.
  const { data: urlData } = await admin.storage
    .from("pdfs-firmados")
    .createSignedUrl(doc.url_pdf_firmado, 86400, { download: `${safeFilename(doc.titulo)}.pdf` });

  if (!urlData?.signedUrl) return { url: null, errorKey: "expired" };

  return { url: urlData.signedUrl, errorKey: null };
}

// ── hideSignatureAction ──────────────────────────────────────────────────────
// Handles both firmantes.id and firmas.id (legacy)

export async function hideSignatureAction(
  id: string,
  locale: string
): Promise<{ error: string | null }> {
  if (!isValidUUID(id)) return { error: "generic" };

  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "generic" };

  // Try firmantes first
  const { data: firmante } = await admin
    .from("firmantes")
    .select("documento_id")
    .eq("id", id)
    .maybeSingle();

  if (firmante) {
    const { data: doc } = await supabase
      .from("documentos")
      .select("id")
      .eq("id", firmante.documento_id)
      .eq("owner_id", user.id)
      .single();
    if (!doc) return { error: "generic" };
    const { error } = await admin.from("firmantes").update({ oculto: true }).eq("id", id);
    if (error) return { error: "generic" };
  } else {
    // Legacy: firmas
    const { data: firma } = await admin
      .from("firmas")
      .select("documento_id")
      .eq("id", id)
      .single();
    if (!firma) return { error: "generic" };
    const { data: doc } = await supabase
      .from("documentos")
      .select("id")
      .eq("id", firma.documento_id)
      .eq("owner_id", user.id)
      .single();
    if (!doc) return { error: "generic" };
    const { error } = await admin.from("firmas").update({ oculto: true }).eq("id", id);
    if (error) return { error: "generic" };
  }

  const prefix = getPrefix(locale);
  revalidatePath(`${prefix}/dashboard/firmas`);
  revalidatePath(`${prefix}/dashboard`);
  return { error: null };
}
