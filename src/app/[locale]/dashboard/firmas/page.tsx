import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface FirmasPageProps {
  params: { locale: string };
}

interface FirmaRow {
  id: string;
  firmado_en: string;
  ip: string | null;
  navegador: string | null;
  sistema_operativo: string | null;
  ubicacion: string | null;
  doc: {
    id: string;
    titulo: string;
    nombre_destinatario: string;
    correo_destinatario: string;
  } | undefined;
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "es" ? "es" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function FirmasPage({ params: { locale } }: FirmasPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations("firmas_page");
  const prefix = locale === "es" ? "" : `/${locale}`;

  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  // Get user docs — explicit owner_id filter as defense in depth over RLS
  const { data: userDocs } = await supabase
    .from("documentos")
    .select("id, titulo, nombre_destinatario, correo_destinatario")
    .eq("owner_id", userId);

  const docMap = new Map((userDocs ?? []).map(d => [d.id, d]));
  const docIds = (userDocs ?? []).map(d => d.id);

  // Query firmas via admin (bypasses deny-all RLS on firmas table)
  let firmas: FirmaRow[] = [];
  if (docIds.length > 0) {
    const { data } = await admin
      .from("firmas")
      .select("id, firmado_en, ip, navegador, sistema_operativo, ubicacion")
      .eq("verificado", true)
      .in("documento_id", docIds)
      .order("firmado_en", { ascending: false });

    if (data) {
      // We need documento_id to link back; re-fetch with it
      const { data: withId } = await admin
        .from("firmas")
        .select("id, documento_id, firmado_en, ip, navegador, sistema_operativo, ubicacion")
        .eq("verificado", true)
        .in("documento_id", docIds)
        .order("firmado_en", { ascending: false });

      firmas = (withId ?? []).map(f => ({
        id: f.id,
        firmado_en: f.firmado_en,
        ip: f.ip,
        navegador: f.navegador,
        sistema_operativo: f.sistema_operativo,
        ubicacion: f.ubicacion,
        doc: docMap.get(f.documento_id),
      }));
    }
  }

  const isEmpty = firmas.length === 0;

  return (
    <div className="p-5 md:p-6 space-y-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-[#111827] leading-tight">{t("title")}</h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{t("subtitle")}</p>
        </div>
        {!isEmpty && (
          <div className="flex items-center gap-2 bg-[#ECFDF5] border border-[#D1FAE5] rounded-[20px] px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-xs font-semibold text-[#065F46]">
              {firmas.length} {t("total")}
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

      {/* ── Desktop table ── */}
      {!isEmpty && (
        <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] overflow-hidden">
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
                  ].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3 whitespace-nowrap">
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
                        <span className="text-sm font-medium text-[#111827] truncate" title={firma.doc?.titulo}>
                          {firma.doc?.titulo ?? "—"}
                        </span>
                      </div>
                    </td>

                    {/* Signer */}
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-[#111827]">
                        {firma.doc?.nombre_destinatario ?? "—"}
                      </p>
                      <p className="text-xs text-[#9CA3AF]">{firma.doc?.correo_destinatario ?? ""}</p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-sm text-[#374151]">
                        {formatDate(firma.firmado_en, locale)}
                      </span>
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
                      <span className="text-xs text-[#374151]">
                        {firma.ubicacion ?? t("na")}
                      </span>
                    </td>

                    {/* IP */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono text-[#6B7280]">
                        {firma.ip ?? t("na")}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ── */}
          <div className="md:hidden divide-y divide-[#F3F4F6]">
            {firmas.map(firma => (
              <div key={firma.id} className="p-4 space-y-2.5">

                {/* Title + date */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#ECFDF5] flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-[#111827] truncate">{firma.doc?.titulo ?? "—"}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-medium text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                    Firmado
                  </span>
                </div>

                {/* Signer */}
                <div className="pl-9">
                  <p className="text-sm font-medium text-[#374151]">{firma.doc?.nombre_destinatario ?? "—"}</p>
                  <p className="text-xs text-[#9CA3AF]">{firma.doc?.correo_destinatario ?? ""}</p>
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
              </div>
            ))}
          </div>

          {/* Footer count */}
          <div className="px-5 py-3 border-t border-[#F3F4F6] bg-[#FAFAFA] rounded-b-[14px]">
            <p className="text-xs text-[#9CA3AF]">
              {firmas.length} {firmas.length === 1
                ? (locale === "es" ? "firma registrada" : "signature registered")
                : (locale === "es" ? "firmas registradas" : "signatures registered")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
