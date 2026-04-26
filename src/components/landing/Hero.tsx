import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface HeroProps {
  locale: string;
}

interface DocumentMockupProps {
  recipient: string;
  signatureLabel: string;
  signedAgo: string;
}

function DocumentMockup({ recipient, signatureLabel, signedAgo }: DocumentMockupProps) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-5 border border-[#E5E7EB]/30 w-full max-w-[260px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-[#F3F4F6]">
        <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-[#111827] truncate">Contrato_servicios.pdf</p>
          <p className="text-[10px] text-[#9CA3AF]">{recipient}</p>
        </div>
      </div>

      {/* Placeholder lines */}
      <div className="space-y-2 mb-4">
        {[100, 85, 92, 100, 72].map((w, i) => (
          <div key={i} className="h-1.5 bg-[#F3F4F6] rounded-full" style={{ width: `${w}%` }} />
        ))}
      </div>

      {/* Signature area */}
      <div className="border border-dashed border-[#E5E7EB] rounded-xl p-2.5 mb-3 bg-[#FAFAFA]">
        <p className="text-[9px] text-[#9CA3AF] mb-1 uppercase tracking-wider font-medium">{signatureLabel}</p>
        <svg viewBox="0 0 180 38" className="w-full h-8" fill="none">
          <path
            d="M8 28 C22 10, 40 34, 58 18 C76 2, 95 32, 114 14 C133 0, 150 26, 170 16"
            stroke="#1a3c5e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center shrink-0">
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-[10px] font-medium text-[#065F46]">{signedAgo}</span>
      </div>
    </div>
  );
}

export default function Hero({ locale }: HeroProps) {
  const t = useTranslations("home.hero");
  const prefix = locale === "es" ? "" : `/${locale}`;

  return (
    <section className="relative overflow-hidden bg-[#0f2640]">
      {/* Subtle decorative circles */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-white/[0.03] pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 rounded-full border border-[#F97316]/[0.06] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">

          {/* ── Left: copy ── */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
              {t("badge")}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.1] mb-5">
              {t("title")}
            </h1>

            <p className="text-[#94b8d4] text-lg leading-relaxed mb-8 max-w-lg">
              {t("subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href={`${prefix}/register`}
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-[11px] text-sm transition-colors"
              >
                {t("cta")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href={`${prefix}/#como`}
                className="inline-flex items-center justify-center gap-2 bg-white/[0.07] hover:bg-white/[0.12] text-white font-medium px-6 py-3 rounded-[11px] text-sm transition-colors border border-white/10"
              >
                {t("secondary_cta")}
              </a>
            </div>

            <p className="text-[#4d7a9e] text-xs">{t("trust")}</p>
          </div>

          {/* ── Right: photo + floating mockup ── */}
          <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
            {/* Photo container */}
            <div className="relative w-full max-w-[420px]">
              {/* Main photo */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=840&auto=format&fit=crop&q=80"
                  alt="Professional using digital signature software"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 420px"
                />
                {/* Gradient overlay — darkens bottom so mockup is readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2640]/70 via-[#0f2640]/10 to-transparent" />
              </div>

              {/* Floating mockup card — bottom-left */}
              <div className="absolute -bottom-6 -left-6 drop-shadow-2xl z-10">
                <DocumentMockup
                  recipient={t("mock_recipient")}
                  signatureLabel={t("mock_signature_label")}
                  signedAgo={t("mock_signed_ago")}
                />
              </div>

              {/* Floating "legal" badge — top-right */}
              <div className="absolute -top-4 -right-4 bg-[#1a3c5e] border border-white/10 rounded-xl px-3 py-2 shadow-xl z-10">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-[11px] font-semibold text-white">100% legal</span>
                </div>
                <p className="text-[9px] text-[#6a9abf] mt-0.5">{t("mock_legal_region")}</p>
              </div>

              {/* Notification pill — right side */}
              <div className="absolute top-1/2 -right-5 -translate-y-1/2 bg-white rounded-xl shadow-xl px-3 py-2 flex items-center gap-2 border border-[#E5E7EB]/60 z-10">
                <div className="w-7 h-7 rounded-full bg-[#10B981] flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#111827] leading-tight">{t("mock_signed")}</p>
                  <p className="text-[9px] text-[#9CA3AF]">{t("mock_ago")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8F9FA] to-transparent pointer-events-none" />
    </section>
  );
}
