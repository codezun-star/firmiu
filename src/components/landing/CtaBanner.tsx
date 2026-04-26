import Link from "next/link";
import { useTranslations } from "next-intl";

interface CtaBannerProps {
  locale: string;
}

export default function CtaBanner({ locale }: CtaBannerProps) {
  const t = useTranslations("home.cta_banner");
  const prefix = locale === "es" ? "" : `/${locale}`;

  return (
    <section className="py-20 bg-[#1a3c5e] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/[0.05] pointer-events-none" />
      <div className="absolute top-10 -right-8 w-44 h-44 rounded-full border border-[#F97316]/[0.12] bg-[#F97316]/[0.04] pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-white/[0.04] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          {t("title")}
        </h2>
        <p className="text-[#94b8d4] text-base mb-8 max-w-xl mx-auto">
          {t("subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`${prefix}/register`}
            className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-7 py-3 rounded-[11px] text-sm transition-colors"
          >
            {t("cta")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href={`${prefix}/#planes`}
            className="inline-flex items-center justify-center gap-2 bg-white/[0.07] hover:bg-white/[0.12] text-white font-medium px-7 py-3 rounded-[11px] text-sm transition-colors border border-white/10"
          >
            {t("secondary")}
          </a>
        </div>
      </div>
    </section>
  );
}
