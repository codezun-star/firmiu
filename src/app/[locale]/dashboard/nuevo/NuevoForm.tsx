"use client";

import { useTranslations } from "next-intl";
import { useState, useRef, useTransition, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import SuccessModal from "@/components/SuccessModal";
import { toast } from "@/lib/toast";
import { uploadDocumentMultiAction } from "@/app/actions/documents";
import type { FirmanteLocal, PosicionFirma } from "./PdfPosicionador";

const PdfPosicionador = dynamic(() => import("./PdfPosicionador"), { ssr: false });

const SIGNER_COLORS = ["#1a3c5e", "#F97316", "#10B981", "#8B5CF6", "#EF4444"];
const MAX_SIGNERS = 5;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function makeEmptyFirmante(): FirmanteLocal {
  return { nombre: "", correo: "", posicion: null };
}

interface NuevoFormProps {
  locale: string;
  defaultNombre?: string;
  defaultCorreo?: string;
}

export default function NuevoForm({ locale, defaultNombre = "", defaultCorreo = "" }: NuevoFormProps) {
  const t = useTranslations("nuevo");
  const prefix = locale === "es" ? "" : `/${locale}`;

  // Pasos: 0=Documento, 1=Posicionar, 2=Firmantes
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Firmantes
  const [firmantes, setFirmantes] = useState<FirmanteLocal[]>([
    { nombre: defaultNombre, correo: defaultCorreo, posicion: null },
  ]);
  const [activeSigner, setActiveSigner] = useState(0);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalSubtitle, setModalSubtitle] = useState("");
  const [isPending, startTransition] = useTransition();

  function applyFile(f: File | null) {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) return;
    setFile(f);
    setErrorKey(null);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    applyFile(e.dataTransfer.files[0] ?? null);
    if (inputRef.current && e.dataTransfer.files[0]) {
      const dt = new DataTransfer();
      dt.items.add(e.dataTransfer.files[0]);
      inputRef.current.files = dt.files;
    }
  }

  function goToStep1() {
    if (!file) { setErrorKey("pdf_required"); return; }
    setErrorKey(null);
    setStep(1);
  }

  function goToStep2() {
    const allPositioned = firmantes.every(f => f.posicion !== null);
    if (!allPositioned) { setErrorKey("position_required"); return; }
    setErrorKey(null);
    setStep(2);
  }

  function handlePlace(signerIndex: number, pos: PosicionFirma) {
    setFirmantes(prev => prev.map((f, i) => i === signerIndex ? { ...f, posicion: pos } : f));
    // Avanzar al siguiente firmante sin posición
    const next = firmantes.findIndex((f, i) => i !== signerIndex && f.posicion === null);
    if (next !== -1) setActiveSigner(next);
  }

  function addSigner() {
    if (firmantes.length >= MAX_SIGNERS) { setErrorKey("max_signers"); return; }
    setFirmantes(prev => [...prev, makeEmptyFirmante()]);
    setActiveSigner(firmantes.length);
  }

  function removeSigner(i: number) {
    if (firmantes.length === 1) return;
    setFirmantes(prev => prev.filter((_, idx) => idx !== i));
    setActiveSigner(Math.max(0, activeSigner - 1));
  }

  function updateFirmante(i: number, field: "nombre" | "correo", value: string) {
    setFirmantes(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: value } : f));
  }

  const handleSubmit = useCallback(async () => {
    setErrorKey(null);

    // Validaciones
    for (const f of firmantes) {
      if (!f.nombre.trim()) { setErrorKey("name_required"); return; }
      const email = f.correo.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrorKey("email_invalid"); return; }
    }
    const correos = firmantes.map(f => f.correo.trim().toLowerCase());
    if (new Set(correos).size !== correos.length) { setErrorKey("email_duplicate"); return; }
    if (!firmantes.every(f => f.posicion !== null)) { setErrorKey("position_required"); return; }

    startTransition(async () => {
      const result = await uploadDocumentMultiAction({
        pdfFile: file!,
        locale,
        firmantes: firmantes.map(f => ({
          nombre: f.nombre.trim(),
          correo: f.correo.trim().toLowerCase(),
          pagina: f.posicion!.pagina,
          campo_x: f.posicion!.campo_x,
          campo_y: f.posicion!.campo_y,
          campo_ancho: f.posicion!.campo_ancho,
          campo_alto: f.posicion!.campo_alto,
        })),
      });
      if (result.success) {
        setModalSubtitle(
          firmantes.length === 1
            ? t("modal_subtitle", { name: firmantes[0].nombre })
            : t("modal_subtitle_multi", { n: firmantes.length })
        );
        setShowModal(true);
      } else {
        setErrorKey(result.errorKey ?? "generic");
      }
    });
  }, [file, firmantes, locale, t]);

  // Indicador de pasos
  const steps = [t("step_upload"), t("step_position"), t("step_signers")];

  return (
    <>
      {showModal && (
        <SuccessModal
          title={t("modal_title")}
          subtitle={modalSubtitle}
          redirectTo={`${prefix}/dashboard/documentos`}
        />
      )}

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-5">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? "bg-[#10B981] text-white" : i === step ? "bg-[#1a3c5e] text-white" : "bg-[#E5E7EB] text-[#9CA3AF]"
              }`}>
                {i < step ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${i === step ? "text-[#1a3c5e]" : "text-[#9CA3AF]"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px flex-1 mb-4 transition-colors ${i < step ? "bg-[#10B981]" : "bg-[#E5E7EB]"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {errorKey && (
        <div role="alert" className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-[9px] flex items-start gap-2">
          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t(`errors.${errorKey}`)}
        </div>
      )}

      {/* ── STEP 0: Subir PDF ── */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">{t("pdf_section")}</p>
                <p className="text-[11px] text-[#9CA3AF]">{t("pdf_section_desc")}</p>
              </div>
            </div>
            <input ref={inputRef} type="file" name="pdf" accept=".pdf,application/pdf" id="pdf-upload"
              className="sr-only" onChange={e => applyFile(e.target.files?.[0] ?? null)} />
            <label htmlFor="pdf-upload"
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all select-none ${
                dragging ? "border-[#F97316] bg-[#FFF7ED] scale-[1.01]"
                : file ? "border-[#10B981]/50 bg-[#ECFDF5]/60"
                : "border-[#E5E7EB] bg-[#FAFAFA] hover:border-[#F97316]/60 hover:bg-[#FFF7ED]/40"
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center px-4 text-center">
                  <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center mb-2.5">
                    <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[13px] font-semibold text-[#111827] break-all max-w-[260px]">{file.name}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{formatBytes(file.size)}</p>
                  <span className="mt-2 text-xs font-medium text-[#F97316] bg-[#FFF7ED] px-2.5 py-0.5 rounded-full">
                    {t("upload_change")}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center px-4 text-center">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                    dragging ? "bg-[#FFF7ED] border border-[#FED7AA]" : "bg-[#F3F4F6] border border-[#E5E7EB]"
                  }`}>
                    <svg className={`w-5 h-5 transition-colors ${dragging ? "text-[#F97316]" : "text-[#9CA3AF]"}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-[#374151]">{t("upload_hint")}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">PDF · Max 20 MB</p>
                </div>
              )}
            </label>
          </div>
          <button type="button" onClick={goToStep1}
            className="w-full bg-[#1a3c5e] hover:bg-[#0f2740] text-white font-semibold py-3 px-4 rounded-[9px] transition-colors text-sm flex items-center justify-center gap-2">
            {t("continue_to_signers")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* ── STEP 1: Posicionar firmas ── */}
      {step === 1 && file && (
        <div className="space-y-4">
          <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-4">
            {/* Selector de firmante activo */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {firmantes.map((_, i) => (
                <button key={i} type="button"
                  onClick={() => setActiveSigner(i)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-xs font-semibold transition-all border"
                  style={{
                    background: activeSigner === i ? SIGNER_COLORS[i % SIGNER_COLORS.length] : "white",
                    color: activeSigner === i ? "white" : SIGNER_COLORS[i % SIGNER_COLORS.length],
                    borderColor: SIGNER_COLORS[i % SIGNER_COLORS.length],
                  }}
                >
                  {i + 1}. {firmantes[i].nombre || t("signer_n", { n: i + 1 })}
                  {firmantes[i].posicion && <span>✓</span>}
                </button>
              ))}
              {firmantes.length < MAX_SIGNERS && (
                <button type="button" onClick={addSigner}
                  className="px-3 py-1.5 rounded-[9px] text-xs font-medium border border-dashed border-[#9CA3AF] text-[#6B7280] hover:border-[#1a3c5e] hover:text-[#1a3c5e] transition-colors">
                  + {t("add_signer")}
                </button>
              )}
            </div>
            <PdfPosicionador
              file={file}
              firmantes={firmantes}
              activeSigner={activeSigner}
              onPlace={handlePlace}
              positionHint={t("position_hint")}
              positionActive={(n) => t("position_active", { n })}
              positionPlaced={(n) => t("position_placed", { n })}
              positionNotPlaced={t("position_not_placed")}
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(0)}
              className="flex-1 bg-white border border-[#E5E7EB] text-[#374151] font-semibold py-3 px-4 rounded-[9px] transition-colors text-sm hover:bg-[#F9FAFB]">
              {t("back")}
            </button>
            <button type="button" onClick={goToStep2}
              className="flex-1 bg-[#1a3c5e] hover:bg-[#0f2740] text-white font-semibold py-3 px-4 rounded-[9px] transition-colors text-sm flex items-center justify-center gap-2">
              {t("continue_to_signers")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Datos de firmantes ── */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#111827]">{t("signers_section")}</p>
              </div>
              {firmantes.length < MAX_SIGNERS && (
                <button type="button" onClick={addSigner}
                  className="text-xs font-medium text-[#1a3c5e] hover:underline flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t("add_signer")}
                </button>
              )}
            </div>

            <div className="space-y-4">
              {firmantes.map((f, i) => (
                <div key={i} className="rounded-[9px] border border-[#E5E7EB] p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                        style={{ background: SIGNER_COLORS[i % SIGNER_COLORS.length] }}>
                        {i + 1}
                      </span>
                      <span className="text-xs font-semibold text-[#374151]">
                        {t("signer_n", { n: i + 1 })}
                        {f.posicion && (
                          <span className="ml-2 text-[#10B981]">· p.{f.posicion.pagina}</span>
                        )}
                      </span>
                    </div>
                    {firmantes.length > 1 && (
                      <button type="button" onClick={() => removeSigner(i)}
                        className="text-xs text-[#9CA3AF] hover:text-red-500 transition-colors">
                        {t("remove_signer")}
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                      {t("recipient_name")}
                    </label>
                    <input type="text" value={f.nombre} required
                      placeholder={t("placeholder_name")}
                      onChange={e => updateFirmante(i, "nombre", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-[9px] border border-[#E5E7EB] text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                      {t("recipient_email")}
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input type="email" value={f.correo} required
                        placeholder={t("placeholder_email")}
                        onChange={e => updateFirmante(i, "correo", e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-[9px] border border-[#E5E7EB] text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)}
              className="flex-1 bg-white border border-[#E5E7EB] text-[#374151] font-semibold py-3 px-4 rounded-[9px] transition-colors text-sm hover:bg-[#F9FAFB]">
              {t("back")}
            </button>
            <button type="button" onClick={handleSubmit} disabled={isPending}
              className="flex-1 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-[9px] transition-colors text-sm flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t("submit")}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t("submit")}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
