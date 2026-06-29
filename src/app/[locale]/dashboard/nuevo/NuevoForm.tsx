"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState, useRef, useTransition, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import SuccessModal from "@/components/SuccessModal";
import { uploadDocumentMultiAction } from "@/app/actions/documents";
import type { FirmanteLocal, PosicionFirma } from "./PdfPosicionador";

const PdfPosicionador = dynamic(() => import("./PdfPosicionador"), { ssr: false });

const SIGNER_COLORS = ["#1a3c5e", "#F97316", "#10B981", "#8B5CF6", "#EF4444"];
const MAX_SIGNERS = 5;

type Modo = "paralelo" | "secuencial";

function isPdf(f: File) {
  return f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function makeEmptyFirmante(): FirmanteLocal {
  return { nombre: "", correo: "", posiciones: [] };
}

// Merge several PDFs into one (client-side). One file → returned as-is.
async function mergeFiles(files: File[]): Promise<File> {
  if (files.length === 1) return files[0];
  const { PDFDocument } = await import("pdf-lib");
  const out = await PDFDocument.create();
  for (const f of files) {
    const src = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach(p => out.addPage(p));
  }
  const bytes = await out.save();
  const base = files[0].name.replace(/\.pdf$/i, "");
  const name = `${base} (+${files.length - 1}).pdf`;
  return new File([new Uint8Array(bytes)], name, { type: "application/pdf" });
}

interface Contact { id: string; nombre: string; correo: string; }

interface NuevoFormProps {
  locale: string;
  defaultNombre?: string;
  defaultCorreo?: string;
  /** Max PDFs that can be merged into one document (plan cap ∩ monthly quota). */
  maxBatch?: number;
  contactos?: Contact[];
  whatNext?: ReactNode;
}

export default function NuevoForm({ locale, defaultNombre = "", defaultCorreo = "", maxBatch = 1, contactos = [], whatNext }: NuevoFormProps) {
  const t = useTranslations("nuevo");
  const prefix = locale === "es" ? "" : `/${locale}`;
  const allowMulti = maxBatch > 1;
  const topRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Pasos: 0=Documentos, 1=Posicionar, 2=Firmantes
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);     // PDFs seleccionados
  const [merged, setMerged] = useState<File | null>(null); // PDF unificado (para posicionar/enviar)
  const [merging, setMerging] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [firmantes, setFirmantes] = useState<FirmanteLocal[]>([
    { nombre: defaultNombre, correo: defaultCorreo, posiciones: [] },
  ]);
  const [modo, setModo] = useState<Modo>("paralelo");
  const [activeSigner, setActiveSigner] = useState(0);
  const [contactPickerFor, setContactPickerFor] = useState<number | null>(null);
  const [contactQuery, setContactQuery] = useState("");

  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalSubtitle, setModalSubtitle] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // ── File selection (multiple → merged) ──────────────────────
  function applyFiles(list: FileList | File[] | null) {
    if (!list) return;
    const pdfs = Array.from(list).filter(isPdf);
    if (pdfs.length === 0) return;
    setErrorKey(null);
    setFiles(prev => [...prev, ...pdfs].slice(0, maxBatch));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    applyFiles(e.dataTransfer.files);
  }

  function removeFile(i: number) {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
  }

  async function goToStep1() {
    if (files.length === 0) { setErrorKey("pdf_required"); return; }
    setErrorKey(null);
    setMerging(true);
    try {
      const m = await mergeFiles(files);
      setMerged(m);
      setStep(1);
    } catch {
      setErrorKey("pdf_invalid");
    } finally {
      setMerging(false);
    }
  }

  function goToStep2() {
    if (!firmantes.every(f => f.posiciones.length > 0)) { setErrorKey("position_required"); return; }
    setErrorKey(null);
    setStep(2);
  }

  // ── Field handlers (multiple fields per signer) ─────────────
  function addField(signerIndex: number, pos: PosicionFirma) {
    setFirmantes(prev => prev.map((f, i) => i === signerIndex ? { ...f, posiciones: [...f.posiciones, pos] } : f));
  }
  function moveField(signerIndex: number, fieldIndex: number, pos: PosicionFirma) {
    setFirmantes(prev => prev.map((f, i) => i === signerIndex
      ? { ...f, posiciones: f.posiciones.map((p, j) => j === fieldIndex ? pos : p) } : f));
  }
  function removeField(signerIndex: number, fieldIndex: number) {
    setFirmantes(prev => prev.map((f, i) => i === signerIndex
      ? { ...f, posiciones: f.posiciones.filter((_, j) => j !== fieldIndex) } : f));
  }

  function addSigner() {
    if (firmantes.length >= MAX_SIGNERS) { setErrorKey("max_signers"); return; }
    setFirmantes(prev => [...prev, makeEmptyFirmante()]);
    setActiveSigner(firmantes.length);
  }
  function removeSigner(i: number) {
    if (firmantes.length === 1) return;
    setFirmantes(prev => prev.filter((_, idx) => idx !== i));
    setActiveSigner(a => Math.max(0, Math.min(a, firmantes.length - 2)));
  }
  function updateFirmante(i: number, field: "nombre" | "correo", value: string) {
    setFirmantes(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: value } : f));
  }
  function pickContact(i: number, c: Contact) {
    setFirmantes(prev => prev.map((f, idx) => idx === i ? { ...f, nombre: c.nombre, correo: c.correo } : f));
    setContactPickerFor(null);
    setContactQuery("");
  }

  const filteredContacts = (() => {
    const q = contactQuery.trim().toLowerCase();
    if (!q) return contactos;
    return contactos.filter(c => c.nombre.toLowerCase().includes(q) || c.correo.toLowerCase().includes(q));
  })();

  function validateAll(): string | null {
    if (!merged) return "pdf_required";
    for (const f of firmantes) {
      if (!f.nombre.trim()) return "name_required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo.trim().toLowerCase())) return "email_invalid";
      if (f.posiciones.length === 0) return "position_required";
    }
    const correos = firmantes.map(f => f.correo.trim().toLowerCase());
    if (new Set(correos).size !== correos.length) return "email_duplicate";
    return null;
  }

  const handleSubmit = useCallback(async () => {
    const err = validateAll();
    if (err) { setErrorKey(err); return; }
    setErrorKey(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("pdf", merged!);
      formData.append("locale", locale);
      formData.append("modo", modo);
      formData.append("firmantes", JSON.stringify(firmantes.map(f => {
        const first = f.posiciones[0];
        return {
          nombre: f.nombre.trim(),
          correo: f.correo.trim().toLowerCase(),
          pagina: first.pagina,
          campo_x: first.campo_x,
          campo_y: first.campo_y,
          campo_ancho: first.campo_ancho,
          campo_alto: first.campo_alto,
          campos: f.posiciones.map(p => ({
            pagina: p.pagina, campo_x: p.campo_x, campo_y: p.campo_y, campo_ancho: p.campo_ancho, campo_alto: p.campo_alto,
          })),
        };
      })));

      const result = await uploadDocumentMultiAction(formData);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merged, firmantes, modo, locale, t]);

  const steps = [t("step_upload"), t("step_position"), t("step_signers")];
  const wrapperClass = step === 1 ? "max-w-6xl mx-auto" : "max-w-5xl mx-auto";

  // ── Step content ─────────────────────────────────────────────

  const step0Content = (
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
            <p className="text-[11px] text-[#9CA3AF]">
              {allowMulti ? t("select_multiple_hint", { max: maxBatch }) : t("pdf_section_desc")}
            </p>
          </div>
        </div>
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" id="pdf-upload"
          multiple={allowMulti} className="sr-only"
          onChange={e => { applyFiles(e.target.files); e.target.value = ""; }} />
        <label htmlFor="pdf-upload"
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all select-none ${
            dragging ? "border-[#F97316] bg-[#FFF7ED] scale-[1.01]"
            : files.length > 0 ? "border-[#10B981]/50 bg-[#ECFDF5]/60"
            : "border-[#E5E7EB] bg-[#FAFAFA] hover:border-[#F97316]/60 hover:bg-[#FFF7ED]/40"
          }`}
        >
          {files.length > 0 ? (
            <div className="flex flex-col items-center px-4 text-center">
              <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center mb-2.5">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[13px] font-semibold text-[#111827] break-all max-w-[260px]">
                {files.length === 1 ? files[0].name : `${files.length} PDF`}
              </p>
              <span className="mt-2 text-xs font-medium text-[#F97316] bg-[#FFF7ED] px-2.5 py-0.5 rounded-full">
                {allowMulti ? `+ PDF` : t("upload_change")}
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

        {files.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-[9px] bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="w-5 h-5 rounded-full bg-[#1a3c5e] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-[#374151] truncate">{f.name}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{formatBytes(f.size)}</p>
                </div>
                <button type="button" onClick={() => removeFile(i)}
                  className="text-[#9CA3AF] hover:text-red-500 transition-colors shrink-0 p-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {files.length > 1 && (
              <p className="text-[11px] text-[#9CA3AF] pt-1">{t("merge_hint")}</p>
            )}
          </div>
        )}
      </div>
      <button type="button" onClick={goToStep1} disabled={merging}
        className="w-full bg-[#1a3c5e] hover:bg-[#0f2740] disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-[9px] transition-colors text-sm flex items-center justify-center gap-2">
        {merging ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>{t("merging")}</span>
          </>
        ) : (
          <>
            {t("continue_to_signers")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </div>
  );

  const step1Content = merged && (
    <div className="space-y-4">
      <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-4 sm:p-5">
        <PdfPosicionador
          file={merged}
          firmantes={firmantes}
          activeSigner={activeSigner}
          onSelectSigner={setActiveSigner}
          onAddSigner={addSigner}
          maxSigners={MAX_SIGNERS}
          signerFallback={(n) => t("signer_n", { n })}
          addSignerLabel={t("add_signer")}
          onAddField={addField}
          onMoveField={moveField}
          onRemoveField={removeField}
          positionHint={t("position_hint")}
          positionActive={(n) => t("position_active", { n })}
          fieldsCount={(n) => t("fields_count", { n })}
          noFields={t("no_fields")}
        />
      </div>
      <div className="flex gap-3 max-w-2xl mx-auto">
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
  );

  const step2Content = (
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
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: SIGNER_COLORS[i % SIGNER_COLORS.length] }}>
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-[#374151]">
                    {t("signer_n", { n: i + 1 })}
                    {f.posiciones.length > 0 && (
                      <span className="ml-2 text-[#10B981]">· {t("fields_count", { n: f.posiciones.length })}</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {contactos.length > 0 && (
                    <button type="button"
                      onClick={() => { setContactPickerFor(contactPickerFor === i ? null : i); setContactQuery(""); }}
                      className="text-xs font-medium text-[#1a3c5e] hover:text-[#F97316] inline-flex items-center gap-1 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 12a4 4 0 100-8 4 4 0 000 8zm0 0c-2.761 0-5 2.239-5 5v2h10v-2c0-2.761-2.239-5-5-5z" />
                      </svg>
                      {t("from_contacts")}
                    </button>
                  )}
                  {firmantes.length > 1 && (
                    <button type="button" onClick={() => removeSigner(i)}
                      className="text-xs text-[#9CA3AF] hover:text-red-500 transition-colors">
                      {t("remove_signer")}
                    </button>
                  )}
                </div>
              </div>

              {contactPickerFor === i && (
                <div className="rounded-[9px] border border-[#E5E7EB] bg-[#F9FAFB] p-2.5 space-y-2">
                  <input type="text" value={contactQuery} onChange={e => setContactQuery(e.target.value)}
                    placeholder={t("contacts_search")} autoFocus
                    className="w-full px-2.5 py-2 rounded-[7px] border border-[#E5E7EB] text-[13px] bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10" />
                  <div className="max-h-44 overflow-y-auto space-y-1">
                    {filteredContacts.length === 0 ? (
                      <p className="text-[12px] text-[#9CA3AF] text-center py-3">{t("contacts_none")}</p>
                    ) : filteredContacts.map(c => (
                      <button key={c.id} type="button" onClick={() => pickContact(i, c)}
                        className="w-full text-left px-2.5 py-2 rounded-[7px] hover:bg-white border border-transparent hover:border-[#E5E7EB] transition-colors">
                        <p className="text-[13px] font-medium text-[#374151] truncate">{c.nombre}</p>
                        <p className="text-[11px] text-[#9CA3AF] truncate">{c.correo}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1.5">{t("recipient_name")}</label>
                <input type="text" value={f.nombre} required placeholder={t("placeholder_name")}
                  onChange={e => updateFirmante(i, "nombre", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[9px] border border-[#E5E7EB] text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1.5">{t("recipient_email")}</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input type="email" value={f.correo} required placeholder={t("placeholder_email")}
                    onChange={e => updateFirmante(i, "correo", e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-[9px] border border-[#E5E7EB] text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {firmantes.length > 1 && (
          <div className="mt-5 pt-4 border-t border-[#F3F4F6]">
            <p className="text-xs font-semibold text-[#111827] mb-2.5">{t("order_mode_title")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {([
                { key: "paralelo" as Modo, title: t("order_parallel"), desc: t("order_parallel_desc") },
                { key: "secuencial" as Modo, title: t("order_sequential"), desc: t("order_sequential_desc") },
              ]).map(opt => {
                const active = modo === opt.key;
                return (
                  <button key={opt.key} type="button" onClick={() => setModo(opt.key)}
                    className={`text-left rounded-[9px] border p-3 transition-colors ${
                      active ? "border-[#1a3c5e] bg-[#1a3c5e]/5" : "border-[#E5E7EB] bg-white hover:border-[#9CA3AF]"
                    }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${active ? "border-[#1a3c5e]" : "border-[#D1D5DB]"}`}>
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-[#1a3c5e]" />}
                      </span>
                      <span className={`text-[13px] font-semibold ${active ? "text-[#1a3c5e]" : "text-[#374151]"}`}>{opt.title}</span>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] leading-snug pl-5">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
  );

  return (
    <>
      {showModal && (
        <SuccessModal title={t("modal_title")} subtitle={modalSubtitle} redirectTo={`${prefix}/dashboard/documentos`} />
      )}

      <div ref={topRef} className="scroll-mt-24" />
      <div className={wrapperClass}>
        <div className="max-w-2xl mx-auto">
          {/* Stepper */}
          <div className="flex items-center gap-0 mb-5 max-w-md mx-auto">
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
                  <span className={`text-[10px] mt-1 font-medium ${i === step ? "text-[#1a3c5e]" : "text-[#9CA3AF]"}`}>{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 mb-4 transition-colors ${i < step ? "bg-[#10B981]" : "bg-[#E5E7EB]"}`} />
                )}
              </div>
            ))}
          </div>

          {errorKey && (
            <div role="alert" className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-[9px] flex items-start gap-2">
              <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t(`errors.${errorKey}`)}
            </div>
          )}
        </div>

        {step === 1 ? (
          <div key="pos" style={{ animation: "firmiu-step-in 0.3s ease" }}>
            {step1Content}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
            <div key={`form-${step}`} className="min-w-0" style={{ animation: "firmiu-step-in 0.3s ease" }}>
              {step === 0 ? step0Content : step2Content}
            </div>
            {whatNext && <div>{whatNext}</div>}
          </div>
        )}
      </div>
    </>
  );
}
