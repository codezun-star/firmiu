"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { addContactAction, hideContactAction } from "@/app/actions/contacts";
import { toast } from "@/lib/toast";

interface Contact {
  id: string;
  nombre: string;
  correo: string;
  empresa: string | null;
  creado_en: string;
}

interface Props {
  locale: string;
  contactos: Contact[];
  page: number;
  totalPages: number;
  totalCount: number;
}

const AVATAR_COLORS = [
  "#1a3c5e", "#2563EB", "#7C3AED", "#F97316", "#10B981", "#EF4444", "#F59E0B",
];

function avatarColor(str: string) {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0] ?? "").join("").toUpperCase().slice(0, 2);
}

export default function ContactosClient({ locale, contactos, page, totalPages, totalCount }: Props) {
  const t = useTranslations("contacts_page");
  const tp = useTranslations("pagination");
  const router = useRouter();
  const prefix = locale === "es" ? "" : `/${locale}`;

  const [search, setSearch]       = useState("");
  const [showModal, setShowModal] = useState(false);
  const [hideId, setHideId]       = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const filtered = contactos.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.correo.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!showModal) formRef.current?.reset();
  }, [showModal]);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.append("locale", locale);
    startTransition(async () => {
      const result = await addContactAction(fd);
      if (!result.error) {
        setShowModal(false);
        router.refresh();
        toast.success(t("toast_added"));
      } else {
        toast.error(t(`errors.${result.error}` as Parameters<typeof t>[0]));
      }
    });
  }

  function handleHide(id: string) {
    startTransition(async () => {
      await hideContactAction(id, locale);
      setHideId(null);
      router.refresh();
      toast.success(t("hide_success"));
    });
  }

  return (
    <div className="p-5 md:p-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[17px] font-semibold text-[#111827] leading-tight">{t("title")}</h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{t("subtitle")}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-[#1a3c5e] hover:bg-[#15304d] text-white text-[13px] font-medium px-4 py-2 rounded-[9px] transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          {t("add")}
        </button>
      </div>

      {/* ── Search ── */}
      {contactos.length > 0 && (
        <div className="relative mb-5 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("placeholder_search")}
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-white border-[0.5px] border-[#E5E7EB] rounded-[9px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]"
          />
        </div>
      )}

      {/* ── Empty state ── */}
      {totalCount === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F0F7FF] border border-[#DBEAFE] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#1a3c5e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-[15px] font-semibold text-[#111827] mb-1">{t("empty_title")}</p>
          <p className="text-[13px] text-[#9CA3AF] max-w-xs">{t("empty_desc")}</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-5 inline-flex items-center gap-2 bg-[#1a3c5e] hover:bg-[#15304d] text-white text-[13px] font-medium px-4 py-2 rounded-[9px] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            {t("add")}
          </button>
        </div>
      )}

      {/* ── No results (filtered search) ── */}
      {totalCount > 0 && filtered.length === 0 && (
        <div className="py-12 text-center text-[13px] text-[#9CA3AF]">
          Sin resultados para &ldquo;{search}&rdquo;
        </div>
      )}

      {/* ── Contact grid ── */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((c) => {
            const color = avatarColor(c.correo);
            const inits = initials(c.nombre);
            const isHiding = hideId === c.id;

            return (
              <div
                key={c.id}
                className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-4 flex flex-col gap-3"
              >
                {/* Top: avatar + info */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-[13px] font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {inits}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[#111827] truncate leading-tight">{c.nombre}</p>
                    <p className="text-[12px] text-[#6B7280] truncate">{c.correo}</p>
                    {c.empresa && (
                      <span className="inline-block mt-0.5 text-[10px] font-medium bg-[#F0F7FF] text-[#1a3c5e] px-2 py-0.5 rounded-full">
                        {c.empresa}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {isHiding ? (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[11px] text-[#6B7280] leading-snug">{t("hide_confirm")}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleHide(c.id)}
                        disabled={isPending}
                        className="text-[11px] font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {t("hide_yes")}
                      </button>
                      <button
                        onClick={() => setHideId(null)}
                        className="text-[11px] font-medium text-[#6B7280] hover:text-[#111827] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href={`${prefix}/dashboard/nuevo?nombre=${encodeURIComponent(c.nombre)}&correo=${encodeURIComponent(c.correo)}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-medium bg-[#FFF7ED] hover:bg-[#FEF3C7] text-[#F97316] border border-[#FED7AA]/60 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t("send_doc")}
                    </Link>
                    <button
                      onClick={() => setHideId(c.id)}
                      className="inline-flex items-center justify-center w-9 h-9 text-[#D1D5DB] hover:text-[#F97316] hover:bg-orange-50 rounded-lg transition-colors"
                      title={t("hide")}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between bg-white rounded-[10px] border-[0.5px] border-[#E5E7EB] px-5 py-3">
          <p className="text-xs text-[#9CA3AF]">
            {tp("showing", {
              from: totalCount === 0 ? 0 : (page - 1) * 10 + 1,
              to: Math.min(page * 10, totalCount),
              count: totalCount,
            })}
          </p>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link href={`?page=${page - 1}`}
                className="text-xs font-medium text-[#1a3c5e] hover:bg-[#F0F7FF] px-3 py-1.5 rounded-lg transition-colors">
                ← {tp("previous")}
              </Link>
            ) : (
              <span className="text-xs font-medium text-[#D1D5DB] px-3 py-1.5">← {tp("previous")}</span>
            )}
            <span className="text-xs text-[#6B7280] px-1">
              {tp("page_of", { page, total: totalPages })}
            </span>
            {page < totalPages ? (
              <Link href={`?page=${page + 1}`}
                className="text-xs font-medium text-[#1a3c5e] hover:bg-[#F0F7FF] px-3 py-1.5 rounded-lg transition-colors">
                {tp("next")} →
              </Link>
            ) : (
              <span className="text-xs font-medium text-[#D1D5DB] px-3 py-1.5">{tp("next")} →</span>
            )}
          </div>
        </div>
      )}

      {/* ── Add contact modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-[18px] w-full max-w-sm shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
              <div>
                <p className="text-[15px] font-semibold text-[#111827]">{t("add")}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{t("subtitle")}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 flex items-center justify-center text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F9FAFB] rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleAdd} className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-[#374151] mb-1.5">{t("name")}</label>
                <input
                  name="nombre"
                  type="text"
                  required
                  autoFocus
                  placeholder={t("placeholder_name")}
                  className="w-full px-3 py-2 text-[13px] bg-white border-[0.5px] border-[#E5E7EB] rounded-[9px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#374151] mb-1.5">{t("email")}</label>
                <input
                  name="correo"
                  type="email"
                  required
                  placeholder={t("placeholder_email")}
                  className="w-full px-3 py-2 text-[13px] bg-white border-[0.5px] border-[#E5E7EB] rounded-[9px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#374151] mb-1.5">{t("company")}</label>
                <input
                  name="empresa"
                  type="text"
                  placeholder={t("placeholder_company")}
                  className="w-full px-3 py-2 text-[13px] bg-white border-[0.5px] border-[#E5E7EB] rounded-[9px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 text-[13px] font-medium text-[#6B7280] hover:text-[#111827] border-[0.5px] border-[#E5E7EB] hover:border-[#D1D5DB] rounded-[9px] transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2 text-[13px] font-medium text-white bg-[#1a3c5e] hover:bg-[#15304d] disabled:opacity-60 rounded-[9px] transition-colors"
                >
                  {isPending ? "..." : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
