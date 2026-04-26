import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Logo from "@/components/Logo";
import DownloadSignedButton from "@/components/DownloadSignedButton";

interface ExitoPageProps {
  params: { locale: string };
  searchParams: { token?: string };
}

export default function ExitoPage({ params: { locale }, searchParams }: ExitoPageProps) {
  setRequestLocale(locale);
  const t = useTranslations("sign_success");
  const { token } = searchParams;

  const steps = [t("step1"), t("step2"), t("step3")];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header */}
      <header className="bg-[#1a3c5e] px-5 py-3.5">
        <Logo locale={locale} white />
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Success icon with audit badge */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center">
                <svg className="w-10 h-10 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#1a3c5e] rounded-lg px-2 py-1 flex items-center gap-1">
                <svg className="w-3 h-3 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-white text-[9px] font-semibold">{t("audit")}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-[22px] font-bold text-[#111827] mb-2">{t("title")}</h1>
            <p className="text-sm text-[#6B7280] leading-relaxed">{t("subtitle")}</p>
          </div>

          {/* Download button */}
          {token ? (
            <div className="mb-5">
              <DownloadSignedButton
                token={token}
                ctaLabel={t("download_cta")}
                hintLabel={t("download_hint")}
                expiredLabel={t("download_expired")}
              />
            </div>
          ) : (
            <div className="mb-5 text-center">
              <p className="text-xs text-[#9CA3AF]">{t("download_expired")}</p>
            </div>
          )}

          {/* What's next */}
          <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-5 mb-5">
            <p className="text-xs font-semibold text-[#111827] mb-4">{t("what_now")}</p>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {i < steps.length - 1 && <div className="w-px h-4 bg-[#F3F4F6] mt-1" />}
                  </div>
                  <p className="text-[13px] text-[#6B7280] leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security note */}
          <div className="bg-[#1a3c5e] rounded-[14px] p-4 flex items-start gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-[12px] font-semibold leading-tight mb-0.5">
                {t("security_title")}
              </p>
              <p className="text-[#6a9abf] text-[11px] leading-relaxed">
                {t("security_desc")}
              </p>
            </div>
          </div>

          {/* Branding */}
          <div className="flex items-center justify-center gap-1.5">
            <svg className="w-3 h-3 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-[11px] text-[#9CA3AF]">Powered by <strong className="text-[#6B7280]">firmiu</strong></span>
          </div>

        </div>
      </div>
    </div>
  );
}
