import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import NuevoForm from "./NuevoForm";
import { createClient } from "@/lib/supabase/server";

// Per-plan cap on documents per batch (mirrors BATCH_LIMITS in actions/documents.ts).
const BATCH_LIMITS: Record<string, number> = { free: 1, starter: 5, pro: 20, business: 50 };

interface NuevoPageProps {
  params: { locale: string };
  searchParams: { nombre?: string; correo?: string };
}

function WhatNextCard() {
  const t = useTranslations("nuevo");

  const steps = [
    {
      icon: (
        <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      text: t("what_next_1"),
    },
    {
      icon: (
        <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      text: t("what_next_2"),
    },
    {
      icon: (
        <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      text: t("what_next_3"),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Steps card */}
      <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-5">
        <p className="text-sm font-semibold text-[#111827] mb-4">{t("what_next_title")}</p>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              {/* Step number + line */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] border border-[#FED7AA]/60 flex items-center justify-center">
                  {step.icon}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-4 bg-[#F3F4F6] mt-1" />
                )}
              </div>
              <p className="text-[13px] text-[#6B7280] leading-relaxed pt-1">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security badge */}
      <div className="bg-[#1a3c5e] rounded-[14px] p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <p className="text-white text-[12px] font-semibold leading-tight mb-0.5">
            {t("security_note")}
          </p>
          <p className="text-[#6a9abf] text-[11px] leading-relaxed">
            Tus documentos se almacenan cifrados. Solo tú y el firmante pueden acceder.
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function NuevoPage({ params: { locale }, searchParams }: NuevoPageProps) {
  setRequestLocale(locale);

  const t = await getTranslations("nuevo");
  const prefix = locale === "es" ? "" : `/${locale}`;

  // ── How many documents can this user upload in one batch right now? ──
  // = min(plan batch cap, remaining monthly quota). Server re-validates on submit.
  let batchLimit = 1;
  let monthlyRemaining = 3;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: sub } = await supabase
      .from("suscripciones")
      .select("plan, documentos_mes, limite_documentos, estado, periodo_fin")
      .eq("owner_id", user.id)
      .maybeSingle();
    const cancelingValid =
      sub?.estado === "canceling" && (!sub.periodo_fin || new Date(sub.periodo_fin as string) > new Date());
    if (sub && (sub.estado === "active" || cancelingValid)) {
      const planKey = (sub.plan as string) ?? "free";
      batchLimit = BATCH_LIMITS[planKey] ?? 1;
      monthlyRemaining = Math.max(0, ((sub.limite_documentos as number) ?? 3) - ((sub.documentos_mes as number) ?? 0));
    } else {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("documentos")
        .select("id", { count: "exact", head: true })
        .gte("creado_en", startOfMonth.toISOString());
      batchLimit = BATCH_LIMITS.free;
      monthlyRemaining = Math.max(0, 3 - (count ?? 0));
    }
  }
  const maxBatch = Math.min(batchLimit, Math.max(1, monthlyRemaining));

  return (
    <div className="p-5 md:p-6">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`${prefix}/dashboard/documentos`}
          className="w-8 h-8 rounded-lg bg-white border-[0.5px] border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:border-[#D1D5DB] transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-[17px] font-semibold text-[#111827] leading-tight">{t("title")}</h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{t("subtitle")}</p>
        </div>
      </div>

      {/* NuevoForm controla su propio ancho por paso: el paso de posicionar usa
          todo el ancho (preview grande) y los demás muestran la barra lateral. */}
      <NuevoForm
        locale={locale}
        defaultNombre={searchParams.nombre ?? ""}
        defaultCorreo={searchParams.correo ?? ""}
        maxBatch={maxBatch}
        whatNext={<WhatNextCard />}
      />
    </div>
  );
}
