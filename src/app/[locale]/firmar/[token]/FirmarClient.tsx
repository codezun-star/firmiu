"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import DownloadSignedButton from "@/components/DownloadSignedButton";
import PdfViewer from "@/components/PdfViewer";
import SuccessModal from "@/components/SuccessModal";
import { signDocumentAction } from "@/app/actions/sign";
import { toast } from "@/lib/toast";

interface SignatureField {
  pagina: number;
  campo_x: number;
  campo_y: number;
  campo_ancho: number;
  campo_alto: number;
}

interface FirmarClientProps {
  locale: string;
  token: string;
  titulo: string;
  nombreDestinatario: string;
  estado: string;
  pdfUrl: string | null;
  fechaFirma: string | null;
  signatureField?: SignatureField | null;
  /** Sequential signing: previous signers haven't signed yet — block the form. */
  waiting?: boolean;
}

export default function FirmarClient({
  locale,
  token,
  titulo,
  nombreDestinatario,
  estado,
  pdfUrl,
  fechaFirma,
  signatureField = null,
  waiting = false,
}: FirmarClientProps) {
  const t = useTranslations("sign");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [modalRedirectTo, setModalRedirectTo] = useState<string | null>(null);
  const [mode, setMode] = useState<"draw" | "upload">("draw");
  const [uploadedPng, setUploadedPng] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Set canvas internal resolution to match its CSS size after layout
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }, []);

  if (estado === "firmado") {
    return <AlreadySigned locale={locale} t={t} token={token} fechaFirma={fechaFirma} />;
  }

  if (waiting) {
    return <WaitingTurn locale={locale} t={t} nombreDestinatario={nombreDestinatario} />;
  }

  // ── Canvas helpers ──────────────────────────────────────────

  function getPos(
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) {
    const pos = getPos(e);
    if (!pos) return;
    setIsDrawing(true);
    setIsEmpty(false);
    lastPos.current = pos;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#1a3c5e";
    ctx.fill();
  }

  function draw(
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) {
    if (!isDrawing || !lastPos.current) return;
    const pos = getPos(e);
    if (!pos) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.strokeStyle = "#1a3c5e";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  }

  function stopDraw() {
    setIsDrawing(false);
    lastPos.current = null;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  }

  // ── Form handlers ───────────────────────────────────────────

  function handleCodeChange(i: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 3) document.getElementById(`otp-${i + 1}`)?.focus();
  }

  function handleCodeKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[i] && i > 0)
      document.getElementById(`otp-${i - 1}`)?.focus();
  }

  // ── Upload signature image ──────────────────────────────────
  // Scale the image down and turn the near-white background transparent so an
  // uploaded photo of a signature looks like the drawn ones (dark strokes, no
  // white box) on both the document and the certificate.
  function processSignatureImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) return reject(new Error("type"));
      if (file.size > 10 * 1024 * 1024) return reject(new Error("size"));
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, 800 / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const ctx = c.getContext("2d");
        if (!ctx) return reject(new Error("ctx"));
        ctx.drawImage(img, 0, 0, w, h);
        try {
          const data = ctx.getImageData(0, 0, w, h);
          const px = data.data;
          for (let i = 0; i < px.length; i += 4) {
            if (px[i] > 240 && px[i + 1] > 240 && px[i + 2] > 240) px[i + 3] = 0;
          }
          ctx.putImageData(data, 0, 0);
        } catch { /* keep image as-is if pixel access fails */ }
        resolve(c.toDataURL("image/png"));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("load")); };
      img.src = url;
    });
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    setProcessing(true);
    try {
      setUploadedPng(await processSignatureImage(file));
    } catch {
      setUploadedPng(null);
      toast.error(t("upload_error"));
    } finally {
      setProcessing(false);
    }
  }

  const hasSignature = mode === "draw" ? !isEmpty : !!uploadedPng;

  async function handleSign() {
    const signaturePng =
      mode === "draw"
        ? (canvasRef.current && !isEmpty ? canvasRef.current.toDataURL("image/png") : null)
        : uploadedPng;
    if (!signaturePng) {
      toast.error(t("errors.signature_required"));
      return;
    }
    const fullCode = code.join("");
    if (fullCode.length < 4) {
      toast.error(t("errors.invalid_code"));
      return;
    }
    const userAgent = window.navigator.userAgent;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setLoading(true);
    try {
      const result = await signDocumentAction({
        token,
        signaturePng,
        code: fullCode,
        locale,
        userAgent,
        timezone,
      });
      if (result?.success && result.redirectTo) {
        setModalRedirectTo(result.redirectTo);
      } else if (result?.errorKey) {
        toast.error(t(`errors.${result.errorKey}` as Parameters<typeof t>[0]));
        setLoading(false);
      }
    } catch {
      toast.error(t("errors.generic"));
      setLoading(false);
    }
  }

  const steps = [t("step1"), t("step2"), t("step3")];
  const initials = nombreDestinatario.split(" ").map(w => w[0] ?? "").join("").slice(0, 2).toUpperCase() || "?";

  // ── Render ──────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {modalRedirectTo && (
        <SuccessModal
          title={t("modal_title")}
          subtitle={t("modal_subtitle")}
          redirectTo={modalRedirectTo}
        />
      )}
      {/* Header */}
      <header className="bg-[#1a3c5e] px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <Logo locale={locale} white />
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 max-w-[180px] sm:max-w-xs overflow-hidden">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shrink-0" />
          <span className="text-white/80 text-xs font-medium truncate">{titulo}</span>
        </div>
      </header>

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#1a3c5e] to-[#1e4976] px-4 py-5">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#F97316] flex items-center justify-center shrink-0 text-white font-bold text-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white/55 text-[11px] leading-tight">{t("welcome_hint")}</p>
            <p className="text-white font-semibold text-[15px] truncate">{nombreDestinatario}</p>
          </div>
        </div>
        {/* Trust strip */}
        <div className="max-w-2xl mx-auto mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-white/60 text-[11px]">
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {t("trust_legal")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {t("trust_encrypted")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t("trust_audit")}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-[#F97316] flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold">{i + 1}</span>
                </div>
                <span className="text-xs text-[#6B7280] hidden sm:block">{label}</span>
              </div>
              {i < 2 && <div className="w-6 h-px bg-[#E5E7EB]" />}
            </div>
          ))}
        </div>

        {/* Step 1: PDF Viewer */}
        <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#F3F4F6]">
            <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0">
              <span className="text-[#F97316] text-xs font-bold">1</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827] leading-tight">{t("step1")}</p>
              <p className="text-[11px] text-[#9CA3AF]">{titulo}.pdf</p>
            </div>
          </div>
          {pdfUrl ? (
            <PdfViewer
              pdfUrl={pdfUrl}
              title={titulo}
              loadingLabel={t("pdf_loading")}
              errorLabel={t("pdf_error")}
              openLabel={t("open_pdf")}
            />
          ) : (
            <div className="h-44 flex flex-col items-center justify-center bg-[#FAFAFA] gap-2">
              <svg className="w-10 h-10 text-[#E5E7EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs text-[#9CA3AF]">{t("pdf_error")}</p>
            </div>
          )}
          {signatureField && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[9px]">
              <svg className="w-4 h-4 text-[#10B981] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <p className="text-xs font-medium text-[#065F46]">
                {t("field_position_hint")} — {`p.${signatureField.pagina}`}
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Signature — draw or upload */}
        <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0">
              <span className="text-[#F97316] text-xs font-bold">2</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827] leading-tight">{t("draw_signature")}</p>
              <p className="text-[11px] text-[#9CA3AF]">{mode === "draw" ? t("canvas_hint") : t("upload_hint")}</p>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="flex items-center gap-1 bg-[#F8F9FA] rounded-lg p-1 mb-4">
            {(["draw", "upload"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                  mode === m ? "bg-white text-[#1a3c5e] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                {m === "draw" ? t("tab_draw") : t("tab_upload")}
              </button>
            ))}
          </div>

          {/* Draw area — canvas stays mounted so its internal size persists */}
          <div className={mode === "draw" ? "" : "hidden"}>
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={clearCanvas}
                className="text-xs font-medium text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] rounded-lg px-2.5 py-1 transition-colors"
              >
                {t("clear")}
              </button>
            </div>
            <div className={`rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
              !isEmpty ? "border-[#10B981]/40 bg-white" : "border-[#F97316]/40 bg-[#FFF7ED]/20"
            }`}>
              <canvas
                ref={canvasRef}
                style={{ width: "100%", height: "160px", display: "block", touchAction: "none", cursor: "crosshair" }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
            </div>
          </div>

          {/* Upload area */}
          {mode === "upload" && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileSelected}
                className="hidden"
              />
              {uploadedPng ? (
                <div className="rounded-xl border-2 border-[#10B981]/40 bg-white p-4 flex flex-col items-center gap-3">
                  <div className="w-full h-[140px] flex items-center justify-center bg-[#F8F9FA] rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={uploadedPng} alt="firma" className="max-h-[120px] max-w-full object-contain" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[#10B981] text-xs font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {t("upload_ready")}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-[#6B7280] hover:text-[#1a3c5e] border border-[#E5E7EB] rounded-lg px-3 py-1.5 transition-colors"
                  >
                    {t("upload_replace")}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={processing}
                  className="w-full rounded-xl border-2 border-dashed border-[#F97316]/40 bg-[#FFF7ED]/20 py-8 px-4 flex flex-col items-center gap-2 hover:bg-[#FFF7ED]/40 transition-colors disabled:opacity-60"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-[#F97316]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="text-xs text-[#6B7280]">{t("upload_processing")}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-7 h-7 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm font-medium text-[#374151]">{t("upload_cta")}</span>
                      <span className="text-[11px] text-[#9CA3AF] text-center">{t("upload_hint")}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Verification code */}
        <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
              <span className="text-[#3B82F6] text-xs font-bold">3</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827] leading-tight">{t("verification_code")}</p>
              <p className="text-[11px] text-[#9CA3AF]">{t("verification_hint")}</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code[i]}
                onChange={(e) => handleCodeChange(i, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(i, e)}
                className="w-14 h-14 text-center text-2xl font-bold rounded-[9px] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Legal note */}
        <p className="text-center text-[11px] text-[#9CA3AF] leading-relaxed px-6">
          {t("legal_note")}
        </p>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSign}
          disabled={loading || !hasSignature}
          className="w-full bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-[9px] transition-colors text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>{t("signing")}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              {t("submit")}
            </>
          )}
        </button>

        {/* Branding */}
        <div className="flex items-center justify-center gap-1.5 pb-4">
          <svg className="w-3 h-3 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[11px] text-[#9CA3AF]">Powered by <strong className="text-[#6B7280]">firmiu</strong></span>
        </div>
      </div>
    </div>
  );
}

// ── WaitingTurn (sequential signing, not this signer's turn yet) ──────────────

function WaitingTurn({
  locale,
  t,
  nombreDestinatario,
}: {
  locale: string;
  t: ReturnType<typeof useTranslations>;
  nombreDestinatario: string;
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <header className="bg-[#1a3c5e] px-5 py-3.5">
        <Logo locale={locale} white />
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-lg font-bold text-[#111827] mb-1">{t("waiting_turn_title")}</h1>
          <p className="text-sm text-[#6B7280]">{nombreDestinatario}</p>
          <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">{t("waiting_turn_desc")}</p>
          <div className="flex items-center justify-center gap-1.5 mt-8">
            <span className="text-[11px] text-[#9CA3AF]">Powered by <strong className="text-[#6B7280]">firmiu</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── AlreadySigned ────────────────────────────────────────────────────────────

function AlreadySigned({
  locale,
  t,
  token,
  fechaFirma,
}: {
  locale: string;
  t: ReturnType<typeof useTranslations>;
  token: string;
  fechaFirma: string | null;
}) {
  const fechaDisplay = fechaFirma
    ? new Date(fechaFirma).toLocaleDateString("es", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <header className="bg-[#1a3c5e] px-5 py-3.5">
        <Logo locale={locale} white />
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Title + date */}
          <div className="text-center mb-6">
            <h1 className="text-lg font-bold text-[#111827] mb-1">{t("already_signed_title")}</h1>
            <p className="text-sm text-[#6B7280]">{t("already_signed_desc")}</p>
            {fechaDisplay && (
              <p className="text-xs text-[#9CA3AF] mt-1">
                {t("already_signed_date")} {fechaDisplay}
              </p>
            )}
          </div>

          {/* Download */}
          <DownloadSignedButton
            token={token}
            ctaLabel={t("already_signed_download")}
            loadingLabel={t("already_signed_loading")}
            expiredLabel={t("already_signed_expired")}
          />

          <div className="flex items-center justify-center gap-1.5 mt-8">
            <span className="text-[11px] text-[#9CA3AF]">Powered by <strong className="text-[#6B7280]">firmiu</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
