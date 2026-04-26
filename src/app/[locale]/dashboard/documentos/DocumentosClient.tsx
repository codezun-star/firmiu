"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Estado = "pendiente" | "visto" | "firmado";
type FilterKey = "todos" | Estado;

export interface DocumentoRow {
  id: string;
  titulo: string;
  nombre_destinatario: string;
  correo_destinatario: string;
  estado: Estado;
  token: string;
  creado_en: string;
  signedOriginalUrl: string | null;
  signedFirmadoUrl: string | null;
}

interface Props {
  documents: DocumentoRow[];
  locale: string;
  appUrl: string;
}

const statusConfig: Record<Estado, { badge: string; dot: string; label: string }> = {
  pendiente: { badge: "bg-[#FFF7ED] text-[#C2410C]", dot: "bg-[#F97316]", label: "status.pendiente" },
  visto:     { badge: "bg-[#EFF6FF] text-[#1D4ED8]", dot: "bg-[#3B82F6]", label: "status.visto" },
  firmado:   { badge: "bg-[#ECFDF5] text-[#065F46]", dot: "bg-[#10B981]", label: "status.firmado" },
};

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "es" ? "es" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DocIcon() {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0">
      <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
  );
}

export default function DocumentosClient({ documents, locale, appUrl }: Props) {
  const t = useTranslations("documents");
  const prefix = locale === "es" ? "" : `/${locale}`;

  const [filter, setFilter]   = useState<FilterKey>("todos");
  const [search, setSearch]   = useState("");
  const [copiedId, setCopied] = useState<string | null>(null);

  /* ── Derived counts ── */
  const totalCount    = documents.length;
  const pendingCount  = documents.filter(d => d.estado === "pendiente").length;
  const signedCount   = documents.filter(d => d.estado === "firmado").length;

  /* ── Filtered list ── */
  const filtered = documents.filter(doc => {
    const matchFilter = filter === "todos" || doc.estado === filter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || doc.titulo.toLowerCase().includes(q)
      || doc.nombre_destinatario.toLowerCase().includes(q)
      || doc.correo_destinatario.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  /* ── Copy sign link ── */
  async function copyLink(doc: DocumentoRow) {
    try {
      await navigator.clipboard.writeText(`${appUrl}/firmar/${doc.token}`);
      setCopied(doc.id);
      setTimeout(() => setCopied(null), 2000);
    } catch { /* ignore */ }
  }

  /* ── Filter tab data ── */
  const tabs: { key: FilterKey; label: string; count: number }[] = [
    { key: "todos",     label: t("filter_all"),       count: totalCount },
    { key: "pendiente", label: t("status.pendiente"),  count: pendingCount },
    { key: "visto",     label: t("status.visto"),      count: documents.filter(d => d.estado === "visto").length },
    { key: "firmado",   label: t("status.firmado"),    count: signedCount },
  ];

  const isEmpty = filtered.length === 0;

  return (
    <div className="p-5 md:p-6 space-y-4">

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t("stats_total"),   value: totalCount,   color: "text-[#F97316]",  bg: "bg-[#FFF7ED]" },
          { label: t("stats_pending"), value: pendingCount, color: "text-[#3B82F6]",  bg: "bg-[#EFF6FF]" },
          { label: t("stats_signed"),  value: signedCount,  color: "text-[#10B981]",  bg: "bg-[#ECFDF5]" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-4">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${s.bg} mb-2`}>
              <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-xs text-[#6B7280]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Main card ── */}
      <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB]">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#F3F4F6]">

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-[#F8F9FA] rounded-lg p-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  filter === tab.key
                    ? "bg-[#1a3c5e] text-white shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                  filter === tab.key ? "bg-white/20 text-white" : "bg-[#E5E7EB] text-[#6B7280]"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative shrink-0">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("search_placeholder")}
              className="pl-8 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-[#F8F9FA] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 w-full sm:w-52 transition-colors"
            />
          </div>
        </div>

        {/* ── Empty state ── */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-[#111827] mb-1.5">
              {search || filter !== "todos" ? t("empty_filtered") : t("empty_title")}
            </p>
            <p className="text-sm text-[#6B7280] mb-5 max-w-xs leading-relaxed">
              {search || filter !== "todos" ? t("empty_filtered_desc") : t("empty_desc")}
            </p>
            {!search && filter === "todos" && (
              <Link
                href={`${prefix}/dashboard/nuevo`}
                className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-medium px-4 py-2 rounded-[9px] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t("new_document_cta")}
              </Link>
            )}
          </div>
        )}

        {/* ── Desktop table ── */}
        {!isEmpty && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[#F3F4F6]">
                  {[
                    t("table.document"),
                    t("table.client"),
                    t("table.status"),
                    t("table.date"),
                    t("table.actions"),
                  ].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {filtered.map(doc => {
                  const cfg = statusConfig[doc.estado];
                  const isCopied = copiedId === doc.id;
                  return (
                    <tr key={doc.id} className="hover:bg-[#FAFAFA] transition-colors group">

                      {/* Document */}
                      <td className="px-5 py-3.5 max-w-[220px]">
                        <div className="flex items-center gap-3">
                          <DocIcon />
                          <span
                            className="text-sm font-medium text-[#111827] truncate"
                            title={doc.titulo}
                          >
                            {doc.titulo}
                          </span>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-[#111827]">
                          {doc.nombre_destinatario}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">{doc.correo_destinatario}</p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[20px] text-[11px] font-medium ${cfg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                          {t(cfg.label)}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="text-sm text-[#6B7280]">
                          {formatDate(doc.creado_en, locale)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">

                          {/* Ver PDF original */}
                          {doc.signedOriginalUrl ? (
                            <a
                              href={doc.signedOriginalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#1a3c5e] hover:text-[#F97316] transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {t("view")}
                            </a>
                          ) : null}

                          {/* Descargar firmado */}
                          {doc.estado === "firmado" && doc.signedFirmadoUrl ? (
                            <a
                              href={doc.signedFirmadoUrl}
                              download
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#10B981] hover:text-[#059669] transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              {t("download")}
                            </a>
                          ) : null}

                          {/* Copiar enlace de firma */}
                          {(doc.estado === "pendiente" || doc.estado === "visto") ? (
                            <button
                              onClick={() => copyLink(doc)}
                              className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${
                                isCopied
                                  ? "text-[#10B981]"
                                  : "text-[#6B7280] hover:text-[#111827]"
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                  {t("copied")}
                                </>
                              ) : (
                                <>
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  {t("copy_link")}
                                </>
                              )}
                            </button>
                          ) : null}

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Mobile cards ── */}
        {!isEmpty && (
          <div className="md:hidden divide-y divide-[#F3F4F6]">
            {filtered.map(doc => {
              const cfg = statusConfig[doc.estado];
              const isCopied = copiedId === doc.id;
              return (
                <div key={doc.id} className="p-4">
                  {/* Title + badge */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-[#111827] truncate">{doc.titulo}</p>
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[20px] text-[10px] font-medium ${cfg.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {t(cfg.label)}
                    </span>
                  </div>

                  {/* Client info */}
                  <div className="pl-9">
                    <p className="text-sm text-[#374151] font-medium">{doc.nombre_destinatario}</p>
                    <p className="text-xs text-[#9CA3AF]">{doc.correo_destinatario}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F3F4F6] pl-9">
                    <span className="text-xs text-[#9CA3AF]">{formatDate(doc.creado_en, locale)}</span>
                    <div className="flex items-center gap-3">
                      {doc.signedOriginalUrl ? (
                        <a
                          href={doc.signedOriginalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-[#1a3c5e] hover:text-[#F97316] transition-colors"
                        >
                          {t("view")}
                        </a>
                      ) : null}
                      {doc.estado === "firmado" && doc.signedFirmadoUrl ? (
                        <a
                          href={doc.signedFirmadoUrl}
                          download
                          className="text-xs font-medium text-[#10B981]"
                        >
                          {t("download")}
                        </a>
                      ) : null}
                      {(doc.estado === "pendiente" || doc.estado === "visto") ? (
                        <button
                          onClick={() => copyLink(doc)}
                          className={`text-xs font-medium transition-colors ${isCopied ? "text-[#10B981]" : "text-[#6B7280]"}`}
                        >
                          {isCopied ? t("copied") : t("copy_link")}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Row count footer */}
        {!isEmpty && (
          <div className="px-5 py-3 border-t border-[#F3F4F6] bg-[#FAFAFA] rounded-b-[14px]">
            <p className="text-xs text-[#9CA3AF]">
              {filtered.length} {filtered.length === 1 ? "documento" : "documentos"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
