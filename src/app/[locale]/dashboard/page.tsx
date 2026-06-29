import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  params: { locale: string };
}

function StatBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[20px] text-[10px] font-medium ${color}`}>
      {label}
    </span>
  );
}

export default async function DashboardPage({ params: { locale } }: DashboardPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const td = await getTranslations("documents");
  const prefix = locale === "es" ? "" : `/${locale}`;

  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  const { data: allDocs } = await supabase
    .from("documentos")
    .select("id, titulo, nombre_destinatario, estado, creado_en")
    .eq("owner_id", userId)
    .eq("oculto", false)
    .order("creado_en", { ascending: false });

  const docs = allDocs ?? [];
  const now = new Date();

  // ── Stats ──────────────────────────────────────────────────
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const totalCount    = docs.length;
  const thisMonth     = docs.filter(d => new Date(d.creado_en) >= startOfMonth).length;

  // ── Plan + monthly usage (for the "Tu plan" card) ──
  const { data: sub } = await supabase
    .from("suscripciones")
    .select("plan, estado, documentos_mes, limite_documentos, periodo_fin")
    .eq("owner_id", userId)
    .maybeSingle();
  const cancelingValid = sub?.estado === "canceling" && (!sub.periodo_fin || new Date(sub.periodo_fin as string) > new Date());
  const planActive = !!sub && (sub.estado === "active" || cancelingValid);
  const planKey    = planActive ? ((sub!.plan as string) ?? "free") : "free";
  const planLimit  = planActive ? ((sub!.limite_documentos as number) ?? 3) : 3;
  const planUsed   = planActive ? ((sub!.documentos_mes as number) ?? 0) : thisMonth;
  const planUnlimited = planLimit >= 999999;
  const planPct = planUnlimited ? 0 : Math.min(100, Math.round((planUsed / Math.max(1, planLimit)) * 100));
  const planLabel = planKey === "free" ? t("plan_free") : planKey.charAt(0).toUpperCase() + planKey.slice(1);
  const pendienteCount = docs.filter(d => d.estado === "pendiente").length;
  const vistoCount    = docs.filter(d => d.estado === "visto").length;
  const firmadoCount  = docs.filter(d => d.estado === "firmado").length;
  const overdueCount  = docs.filter(d =>
    (d.estado === "pendiente" || d.estado === "visto") &&
    new Date(d.creado_en) < sevenDaysAgo
  ).length;

  // Sparkline: docs per day for last 7 days (oldest → newest)
  const sparkData = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (6 - i));
    const dayStr = day.toISOString().slice(0, 10);
    return docs.filter(d => d.creado_en.slice(0, 10) === dayStr).length;
  });
  const sparkMax = Math.max(...sparkData, 1);

  // Recent 5 documents
  const recentDocs = docs.slice(0, 5);

  // Activity: latest signed firmas for this user's docs
  const docIds = docs.map(d => d.id);
  let activityItems: { docTitulo: string; signer: string; firmado_en: string }[] = [];

  if (docIds.length > 0) {
    const { data: firmantesData } = await admin
      .from("firmantes")
      .select("firmado_en, documento_id, nombre")
      .eq("estado", "firmado")
      .in("documento_id", docIds)
      .order("firmado_en", { ascending: false })
      .limit(10);

    activityItems = (firmantesData ?? [])
      .filter(f => f.firmado_en)
      .map(f => {
        const doc = docs.find(d => d.id === f.documento_id);
        return {
          docTitulo: doc?.titulo ?? "—",
          signer: (f.nombre as string) ?? "—",
          firmado_en: f.firmado_en as string,
        };
      })
      .sort((a, b) => new Date(b.firmado_en).getTime() - new Date(a.firmado_en).getTime())
      .slice(0, 5);
  }

  // ── Helpers ─────────────────────────────────────────────────
  function formatRelative(iso: string) {
    const diff = Math.floor((now.getTime() - new Date(iso).getTime()) / 1000);
    if (diff < 60)    return t("just_now");
    if (diff < 3600)  return `${Math.floor(diff / 60)} ${t("time_min")}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ${t("time_h")}`;
    return `${Math.floor(diff / 86400)} ${t("time_d")}`;
  }

  const statusStyles: Record<string, string> = {
    pendiente: "bg-[#FFF7ED] text-[#C2410C]",
    visto:     "bg-[#EFF6FF] text-[#1D4ED8]",
    firmado:   "bg-[#ECFDF5] text-[#065F46]",
  };

  const signedPct = totalCount > 0 ? Math.round((firmadoCount / totalCount) * 100) : 0;
  const pendingPct = totalCount > 0
    ? ((pendienteCount + vistoCount) / totalCount) * 78
    : 0;

  return (
    <div className="p-5 md:p-6 space-y-5">

      {/* ── Stat cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Card 1 — Total */}
        <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-[18px] overflow-hidden relative">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#F97316]/7 pointer-events-none" />
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-[#6B7280]">{t("stats.total")}</p>
            <StatBadge label={t("stats.this_month")} color="bg-[#FFF7ED] text-[#C2410C]" />
          </div>
          <p className="text-[32px] font-medium text-[#F97316] leading-none mb-1">{totalCount}</p>
          <p className="text-[11px] text-[#6B7280] mb-3">
            {thisMonth} {t("this_month_suffix")}
          </p>
          <div className="flex items-end gap-0.5 h-6">
            {sparkData.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${Math.max(Math.round((v / sparkMax) * 100), 8)}%`,
                  background: i === 6 ? "#F97316" : `rgba(249,115,22,${0.12 + i * 0.08})`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Card 2 — Pendientes */}
        <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-[18px]">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-[#6B7280]">{t("stats.pending")}</p>
            <StatBadge label={t("stats.action_required")} color="bg-[#EFF6FF] text-[#1D4ED8]" />
          </div>
          <div className="flex items-center gap-4 mb-3">
            <p className="text-[32px] font-medium text-[#3B82F6] leading-none">
              {pendienteCount + vistoCount}
            </p>
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#EFF6FF" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14"
                fill="none" stroke="#3B82F6" strokeWidth="3"
                strokeDasharray={`${pendingPct.toFixed(1)} 78`}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="border-t border-[#F3F4F6] pt-3 grid grid-cols-2 gap-1">
            {[
              { label: t("stats.not_opened"), val: pendienteCount },
              { label: t("stats.in_review"),  val: vistoCount },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-[13px] font-semibold text-[#111827]">{s.val}</p>
                <p className="text-[9px] text-[#9CA3AF] leading-tight mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3 — Firmados */}
        <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-[18px]">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-[#6B7280]">{t("stats.signed")}</p>
            <StatBadge label={`${signedPct}%`} color="bg-[#ECFDF5] text-[#065F46]" />
          </div>
          <p className="text-[32px] font-medium text-[#10B981] leading-none mb-3">{firmadoCount}</p>
          <div className="mb-2">
            <div className="flex justify-between text-[10px] text-[#6B7280] mb-1">
              <span>{firmadoCount} / {totalCount}</span>
              <span>{signedPct}%</span>
            </div>
            <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F97316] rounded-full transition-all"
                style={{ width: `${signedPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 4 — Esperando respuesta */}
        <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-[18px]">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-[#6B7280]">{t("stats.overdue")}</p>
            {overdueCount > 0 && (
              <StatBadge label={t("stats.attention")} color="bg-[#FEF2F2] text-[#991B1B]" />
            )}
          </div>
          <p className={`text-[32px] font-medium leading-none mb-3 ${overdueCount > 0 ? "text-[#EF4444]" : "text-[#6B7280]"}`}>
            {overdueCount}
          </p>
          <p className="text-[11px] text-[#6B7280] leading-snug">
            {t("stats.unsigned_old")}
          </p>
          {overdueCount > 0 && (
            <Link
              href={`${prefix}/dashboard/documentos`}
              className="mt-3 w-full text-[11px] font-medium bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] rounded-lg py-1.5 hover:bg-red-100 transition-colors flex items-center justify-center"
            >
              {t("stats.view_overdue")}
            </Link>
          )}
        </div>
      </div>

      {/* ── Bottom grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent documents */}
        <div className="lg:col-span-2 bg-white rounded-[10px] border-[0.5px] border-[#E5E7EB]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
            <p className="text-sm font-semibold text-[#111827]">{t("recent_documents")}</p>
            <Link
              href={`${prefix}/dashboard/documentos`}
              className="text-xs text-[#F97316] hover:text-[#EA580C] font-medium transition-colors"
            >
              {t("view_all")}
            </Link>
          </div>

          {recentDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm text-[#6B7280] mb-3">{t("empty.description")}</p>
              <Link
                href={`${prefix}/dashboard/nuevo`}
                className="inline-flex items-center gap-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold px-3 py-2 rounded-[9px] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t("new_document")}
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#F3F4F6]">
              {recentDocs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between px-5 py-3 hover:bg-[#FAFAFA] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#111827] truncate">{doc.titulo}</p>
                      <p className="text-xs text-[#6B7280]">{doc.nombre_destinatario}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 ml-3 inline-flex items-center px-2 py-0.5 rounded-[20px] text-[10px] font-medium ${statusStyles[doc.estado]}`}>
                    {td(`status.${doc.estado}`)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-[10px] border-[0.5px] border-[#E5E7EB]">
          <div className="px-5 py-4 border-b border-[#F3F4F6]">
            <p className="text-sm font-semibold text-[#111827]">{t("activity")}</p>
          </div>
          <div className="px-5 py-3 divide-y divide-[#F3F4F6]">
            {activityItems.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] py-6 text-center">
                {t("no_activity")}
              </p>
            ) : (
              activityItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-3">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-[#111827] leading-snug">
                      <span className="font-medium">{item.signer}</span>
                      <span className="text-[#6B7280]">
                        {" "}{t("activity_signed")}{" "}
                      </span>
                      <span className="truncate">{item.docTitulo}</span>
                    </p>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">{formatRelative(item.firmado_en)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Quick actions + plan usage ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Quick actions */}
        <div className="lg:col-span-2 bg-white rounded-[10px] border-[0.5px] border-[#E5E7EB]">
          <div className="px-5 py-4 border-b border-[#F3F4F6]">
            <p className="text-sm font-semibold text-[#111827]">{t("quick_actions")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5">
            {[
              { href: `${prefix}/dashboard/nuevo`, label: t("action_new"), bg: "bg-[#FFF7ED]", fg: "text-[#F97316]",
                path: "M12 4v16m8-8H4" },
              { href: `${prefix}/dashboard/documentos`, label: t("action_documents"), bg: "bg-[#EFF6FF]", fg: "text-[#3B82F6]",
                path: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { href: `${prefix}/dashboard/contactos`, label: t("action_contacts"), bg: "bg-[#ECFDF5]", fg: "text-[#10B981]",
                path: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
              { href: `${prefix}/dashboard/cuenta`, label: t("action_settings"), bg: "bg-[#F5F3FF]", fg: "text-[#8B5CF6]",
                path: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" },
            ].map((a) => (
              <Link key={a.href} href={a.href}
                className="flex flex-col items-center justify-center gap-2 rounded-[10px] border border-[#F3F4F6] py-4 hover:border-[#E5E7EB] hover:bg-[#FAFAFA] transition-colors text-center">
                <div className={`w-9 h-9 rounded-lg ${a.bg} flex items-center justify-center`}>
                  <svg className={`w-4.5 h-4.5 ${a.fg}`} style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={a.path} />
                  </svg>
                </div>
                <span className="text-[12px] font-medium text-[#374151] leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Plan usage */}
        <div className="bg-white rounded-[10px] border-[0.5px] border-[#E5E7EB]">
          <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
            <p className="text-sm font-semibold text-[#111827]">{t("your_plan")}</p>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1a3c5e] text-white">{planLabel}</span>
          </div>
          <div className="px-5 py-5">
            {planUnlimited ? (
              <p className="text-[13px] text-[#374151]">{t("plan_unlimited")}</p>
            ) : (
              <>
                <div className="flex justify-between text-[11px] text-[#6B7280] mb-1.5">
                  <span>{t("plan_usage", { used: planUsed, limit: planLimit })}</span>
                  <span>{planPct}%</span>
                </div>
                <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F97316] rounded-full transition-all" style={{ width: `${planPct}%` }} />
                </div>
              </>
            )}
            <Link href={`${prefix}/dashboard/cuenta`}
              className="mt-4 w-full inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#1a3c5e] border border-[#E5E7EB] rounded-lg py-2 hover:bg-[#F9FAFB] transition-colors">
              {t("manage_plan")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
