import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface HeroProps {
  locale: string;
}

export default function Hero({ locale }: HeroProps) {
  const t = useTranslations("home.hero");
  const prefix = locale === "es" ? "" : `/${locale}`;

  return (
    <section className="relative overflow-hidden bg-[#0f2640] min-h-[540px] flex items-center">
      {/* Full-bleed background image (business team) */}
      <Image
        src="/hero.jpg"
        alt="Equipo de empresarios firmando documentos digitalmente con Firmiu"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Overlays: dark navy on the left so the copy is readable; lighter on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f2640] via-[#0f2640]/92 to-[#0f2640]/45" />
      <div className="absolute inset-0 bg-[#0f2640]/25" />

      {/* Subtle decorative ring */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 w-full">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#F97316]/15 border border-[#F97316]/25 text-[#F97316] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
            {t("badge")}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.08] mb-5 drop-shadow">
            {t("title")}
          </h1>

          <p className="text-[#c3d6e8] text-lg leading-relaxed mb-8 max-w-lg">
            {t("subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-7">
            <Link
              href={`${prefix}/register`}
              className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-[11px] text-sm transition-colors shadow-lg shadow-[#F97316]/20"
            >
              {t("cta")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href={`${prefix}/#como`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/[0.18] text-white font-medium px-6 py-3 rounded-[11px] text-sm transition-colors border border-white/15 backdrop-blur-sm"
            >
              {t("secondary_cta")}
            </a>
          </div>

          <p className="text-[#94b8d4] text-xs">{t("trust")}</p>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8F9FA] to-transparent pointer-events-none" />
    </section>
  );
}
