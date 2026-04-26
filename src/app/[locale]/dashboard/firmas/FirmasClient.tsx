"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { hideSignatureAction } from "@/app/actions/sign";
import { toast } from "@/lib/toast";
import type { FirmaWithDoc } from "./page";

interface Props {
  firmas: FirmaWithDoc[];
  page: number;
  totalPages: number;
  totalCount: number;
  locale: string;
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleString(locale === "es" ? "es-HN" : "en-US", {
    timeZone: "America/Tegucigalpa",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FirmasClient({ firmas, page, totalPages, totalCount, locale }: Props) {
  const t = useTranslations("firmas_page");
  const tp = useTranslations("pagination");
  const td = useTranslations("documents");
  const router = useRouter();
  const prefix = locale === "es" ? "" : `/${locale}`;

  const [hideId, setHideId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleHide(id: string) {
    startTransition(async () => {
      const result = await hideSignatureAction(id, locale);
      if (!result.error) {
        setHideId(null);
        router.refresh();
        toast.success(t("hide_success"));
      } else {
        toast.error(t("hide_success"));
      }
    });
  }

  const isEmpty = totalCount === 0 && page === 1;

  return (
    <div className="p-5 md:p-6 space-y-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-[#111827] leading-tight">{t("title")}</h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{t("subtitle")}</p>
        </div>
        {totalCount > 0 && (
          <div className="flex items-center gap-2 bg-[#ECFDF5] border border-[#D1FAE5] rounded-[20px] px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-xs font-semibold text-[#065F46]">
              {totalCount} {t("total")}
            </span>
          </div>
        )}
      </div>

      {/* ── Empty state ── */}
      {isEmpty && (
        <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-12 text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-[#111827] mb-2">{t("empty_title")}</h2>
          <p className="text-xs text-[#6B7280] leading-relaxed mb-5">{t("empty_desc")}</p>
          <Link
            href={`${prefix}/dashboard/nuevo`}
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold px-4 py-2.5 rounded-[9px] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t("send_first")}
          </Link>
        </div>
      )}

      {/* ── Table + Pagination ── */}
      {!isEmpty && (
        <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] overflow-hidden">

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[#F3F4F6]">
                  {[
                    t("col_document"),
                    t("col_signer"),
                    t("col_date"),
                    t("col_device"),
                    t("col_location"),
                    t("col_ip"),
                    "",
                  ].map((h, i) => (
                    <th key={i} className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {firmas.map(firma => (
                  <tr key={firma.id} className="hover:bg-[#FAFAFA] transition-colors">

                    {/* Document */}
                    <td className="px-5 py-3.5 max-w-[180px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#ECFDF5] flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-[#111827] truncate" title={firma.docTitulo}>
                          {firma.docTitulo}
                        </span>
                      </div>
                    </td>

                    {/* Signer */}
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-[#111827]">{firma.docNombre}</p>
                      <p className="text-xs text-[#9CA3AF]">{firma.docCorreo}</p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-sm text-[#374151]">{formatDate(firma.firmado_en, locale)}</span>
                    </td>

                    {/* Device */}
                    <td className="px-5 py-3.5">
                      {firma.navegador || firma.sistema_operativo ? (
                        <div>
                          <p className="text-xs font-medium text-[#374151]">{firma.navegador ?? t("na")}</p>
                          <p className="text-[11px] text-[#9CA3AF]">{firma.sistema_operativo ?? ""}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-[#9CA3AF]">{t("na")}</span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-[#374151]">{firma.ubicacion ?? t("na")}</span>
                    </td>

                    {/* IP */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono text-[#6B7280]">{firma.ip ?? t("na")}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {hideId === firma.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#6B7280] max-w-[140px] leading-tight">{t("hide_confirm")}</span>
                          <button
                            onClick={() => handleHide(firma.id)}
                            disabled={isPending}
                            className="text-[11px] font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {t("hide")}
                          </button>
                          <button
                            onClick={() => setHideId(null)}
                            className="text-[11px] font-medium text-[#6B7280] hover:text-[#111827] px-2.5 py-1 rounded-lg transition-colors"
                          >
                            {t("cancel")}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setHideId(firma.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#D1D5DB] hover:text-[#F97316] transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                          {t("hide")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#F3F4F6]">
            {firmas.map(firma => (
              <div key={firma.id} className="p-4 space-y-2.5">
                {/* Title + badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#ECFDF5] flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-[#111827] truncate">{firma.docTitulo}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-medium text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                    {td("status.firmado")}
                  </span>
                </div>

                {/* Signer */}
                <div className="pl-9">
                  <p className="text-sm font-medium text-[#374151]">{firma.docNombre}</p>
                  <p className="text-xs text-[#9CA3AF]">{firma.docCorreo}</p>
                </div>

                {/* Audit details */}
                <div className="pl-9 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-[#F3F4F6] pt-2.5">
                  <div>
                    <p className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">{t("col_date")}</p>
                    <p className="text-xs text-[#374151]">{formatDate(firma.firmado_en, locale)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">{t("col_ip")}</p>
                    <p className="text-xs font-mono text-[#6B7280]">{firma.ip ?? t("na")}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">{t("col_device")}</p>
                    <p className="text-xs text-[#374151]">
                      {firma.navegador ?? t("na")}
                      {firma.sistema_operativo ? ` · ${firma.sistema_operativo}` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">{t("col_location")}</p>
                    <p className="text-xs text-[#374151]">{firma.ubicacion ?? t("na")}</p>
                  </div>
                </div>

                {/* Hide action */}
                <div className="pl-9">
                  {hideId === firma.id ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-[#6B7280]">{t("hide_confirm")}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleHide(firma.id)}
                          disabled={isPending}
                          className="text-[11px] font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {t("hide")}
                        </button>
                        <button
                          onClick={() => setHideId(null)}
                          className="text-[11px] font-medium text-[#6B7280] hover:text-[#111827] px-2.5 py-1 rounded-lg transition-colors"
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setHideId(firma.id)}
                      className="text-[11px] font-medium text-[#D1D5DB] hover:text-[#F97316] transition-colors"
                    >
                      {t("hide")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination footer */}
          <div className="px-5 py-3 border-t border-[#F3F4F6] bg-[#FAFAFA] rounded-b-[14px] flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">
              {tp("showing", {
                from: totalCount === 0 ? 0 : (page - 1) * 10 + 1,
                to: Math.min(page * 10, totalCount),
                count: totalCount,
              })}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Link
                    href={`?page=${page - 1}`}
                    className="text-xs font-medium text-[#1a3c5e] hover:bg-[#F0F7FF] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ← {tp("previous")}
                  </Link>
                ) : (
                  <span className="text-xs font-medium text-[#D1D5DB] px-3 py-1.5">← {tp("previous")}</span>
                )}
                <span className="text-xs text-[#6B7280] px-1">
                  {tp("page_of", { page, total: totalPages })}
                </span>
                {page < totalPages ? (
                  <Link
                    href={`?page=${page + 1}`}
                    className="text-xs font-medium text-[#1a3c5e] hover:bg-[#F0F7FF] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {tp("next")} →
                  </Link>
                ) : (
                  <span className="text-xs font-medium text-[#D1D5DB] px-3 py-1.5">{tp("next")} →</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
