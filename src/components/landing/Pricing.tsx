"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import PricingCards from "./PricingCards";

interface PricingProps {
  locale: string;
}

export default function Pricing({ locale }: PricingProps) {
  const t = useTranslations("home.pricing");
  const prefix = locale === "es" ? "" : `/${locale}`;

  return (
    <section id="planes" className="py-20 bg-[#F8F9FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-3">
            {t("title")}
          </h2>
          <p className="text-[#6B7280] text-base">
            {t("subtitle")}
          </p>
        </div>

        <PricingCards locale={locale} />

        {/* Aclaración del "PDF por envío" (la fusión cuenta cada PDF) */}
        <p className="text-center text-xs text-[#9CA3AF] mt-5 max-w-2xl mx-auto leading-relaxed">
          {t("per_send_note")}
        </p>

        {/* Enlace a la página completa de precios con tabla comparativa */}
        <div className="mt-8 text-center">
          <Link
            href={`${prefix}/precios`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a3c5e] hover:text-[#F97316] transition-colors"
          >
            {t("compare_all")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
