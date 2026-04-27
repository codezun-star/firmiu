"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import DownloadSignedButton from "@/components/DownloadSignedButton";
import SuccessModal from "@/components/SuccessModal";
import { signDocumentAction } from "@/app/actions/sign";
import { toast } from "@/lib/toast";

interface FirmarClientProps {
  locale: string;
  token: string;
  titulo: string;
  nombreDestinatario: string;
  estado: string;
  pdfUrl: string | null;
  fechaFirma: string | null;
}

export default function FirmarClient({
  locale,
  token,
  titulo,
  nombreDestinatario,
  estado,
  pdfUrl,
  fechaFirma,
}: FirmarClientProps) {
  const t = useTranslations("sign");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [modalRedirectTo, setModalRedirectTo] = useState<string | null>(null);

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

  async function handleSign() {
    if (isEmpty || !canvasRef.current) {
      toast.error(t("errors.signature_required"));
      return;
    }
    const fullCode = code.join("");
    if (fullCode.length < 4) {
      toast.error(t("errors.invalid_code"));
      return;
    }
    const signaturePng = canvasRef.current.toDataURL("image/png");
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
      <div className="bg-gradient-to-r from-[#1a3c5e] to-[#1e4976] px-4 py-4 text-center">
        <p className="text-white/50 text-[11px] mb-0.5">{t("welcome_hint")}</p>
        <p className="text-white font-semibold text-sm">{nombreDestinatario}</p>
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
            <iframe src={pdfUrl} className="w-full h-[420px]" title={titulo} referrerPolicy="no-referrer" />
          ) : (
            <div className="h-44 flex flex-col items-center justify-center bg-[#FAFAFA] gap-2">
              <svg className="w-10 h-10 text-[#E5E7EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs text-[#9CA3AF]">{t("pdf_error")}</p>
            </div>
          )}
        </div>

        {/* Step 2: Signature canvas */}
        <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0">
                <span className="text-[#F97316] text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827] leading-tight">{t("draw_signature")}</p>
                <p className="text-[11px] text-[#9CA3AF]">{t("canvas_hint")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearCanvas}
              className="text-xs font-medium text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] rounded-lg px-2.5 py-1 transition-colors"
            >
              {t("clear")}
            </button>
          </div>
          <div className={`rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
            isEmpty ? "border-[#F97316]/40 bg-[#FFF7ED]/20" : "border-[#10B981]/40 bg-white"
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
          {isEmpty && (
            <p className="text-[11px] text-[#9CA3AF] text-center mt-2">{t("canvas_hint")}</p>
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
          disabled={loading}
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
