"use client";

import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import SubmitButton from "@/components/SubmitButton";
import { uploadDocumentAction } from "@/app/actions/documents";
import SuccessModal from "@/components/SuccessModal";

const initialState = { errorKey: null, success: false };

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface NuevoFormProps {
  locale: string;
  defaultNombre?: string;
  defaultCorreo?: string;
}

export default function NuevoForm({ locale, defaultNombre = "", defaultCorreo = "" }: NuevoFormProps) {
  const t = useTranslations("nuevo");
  const [state, action] = useFormState(uploadDocumentAction, initialState);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (state.success) setShowModal(true);
  }, [state.success]);

  const prefix = locale === "es" ? "" : `/${locale}`;

  function applyFile(f: File | null) {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) return;
    setFile(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (!dropped) return;
    applyFile(dropped);
    if (inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(dropped);
      inputRef.current.files = dt.files;
    }
  }

  return (
    <>
    {showModal && (
      <SuccessModal
        title={t("modal_title")}
        subtitle={t("modal_subtitle", { name: state.destinatario ?? "" })}
        redirectTo={`${prefix}/dashboard/documentos`}
      />
    )}
    <form action={action} encType="multipart/form-data" className="space-y-4">
      <input type="hidden" name="locale" value={locale} />

      {/* Error alert */}
      {state.errorKey && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-[9px] flex items-start gap-2">
          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t(`errors.${state.errorKey}`)}
        </div>
      )}

      {/* ── PDF section ── */}
      <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827] leading-tight">{t("pdf_section")}</p>
            <p className="text-[11px] text-[#9CA3AF]">{t("pdf_section_desc")}</p>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          name="pdf"
          accept=".pdf,application/pdf"
          id="pdf-upload"
          className="sr-only"
          onChange={e => applyFile(e.target.files?.[0] ?? null)}
        />

        {/* Drop zone */}
        <label
          htmlFor="pdf-upload"
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all select-none ${
            dragging
              ? "border-[#F97316] bg-[#FFF7ED] scale-[1.01]"
              : file
              ? "border-[#10B981]/50 bg-[#ECFDF5]/60"
              : "border-[#E5E7EB] bg-[#FAFAFA] hover:border-[#F97316]/60 hover:bg-[#FFF7ED]/40"
          }`}
        >
          {file ? (
            /* ── File selected state ── */
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
            /* ── Empty state ── */
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

      {/* ── Recipient section ── */}
      <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827] leading-tight">{t("recipient_section")}</p>
            <p className="text-[11px] text-[#9CA3AF]">{t("recipient_section_desc")}</p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="nombre_destinatario" className="block text-xs font-medium text-[#6B7280] mb-1.5">
            {t("recipient_name")}
          </label>
          <input
            id="nombre_destinatario"
            name="nombre_destinatario"
            type="text"
            required
            defaultValue={defaultNombre}
            placeholder="María López"
            className="w-full px-3 py-2.5 rounded-[9px] border border-[#E5E7EB] text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="correo_destinatario" className="block text-xs font-medium text-[#6B7280] mb-1.5">
            {t("recipient_email")}
          </label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              id="correo_destinatario"
              name="correo_destinatario"
              type="email"
              required
              defaultValue={defaultCorreo}
              placeholder="maria@empresa.com"
              className="w-full pl-9 pr-3 py-2.5 rounded-[9px] border border-[#E5E7EB] text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      <SubmitButton className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3 px-4 rounded-[9px] transition-colors text-sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {t("submit")}
      </SubmitButton>
    </form>
    </>
  );
}
