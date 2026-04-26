import { useTranslations } from "next-intl";
import AuthLanguageSwitcher from "./AuthLanguageSwitcher";

interface AuthPageShellProps {
  locale: string;
  children: React.ReactNode;
}

export default function AuthPageShell({ locale, children }: AuthPageShellProps) {
  const t = useTranslations("auth.panel");

  const features = [
    {
      icon: (
        <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t("feature1_title"),
      desc: t("feature1_desc"),
    },
    {
      icon: (
        <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t("feature2_title"),
      desc: t("feature2_desc"),
    },
    {
      icon: (
        <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: t("feature3_title"),
      desc: t("feature3_desc"),
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (hidden on mobile) ─────────────────── */}
      <div className="hidden md:flex md:w-[220px] lg:w-[300px] bg-[#1a3c5e] flex-col relative overflow-hidden shrink-0">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-white/5 bg-white/[0.02]" />
        <div className="absolute top-32 -right-8 w-36 h-36 rounded-full border border-[#F97316]/10 bg-[#F97316]/[0.04]" />
        <div className="absolute bottom-20 -left-10 w-48 h-48 rounded-full border border-white/5 bg-white/[0.02]" />

        <div className="relative z-10 flex flex-col flex-1 p-7">
          {/* Logo */}
          <div className="mb-8">
            <p className="text-2xl font-medium tracking-tight">
              <span className="text-white">firm</span>
              <span className="text-[#F97316]">iu</span>
            </p>
            <p className="text-[#94b8d4] text-xs mt-1">{t("tagline")}</p>
          </div>

          {/* Features */}
          <div className="space-y-5 flex-1">
            {features.map((f, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-[rgba(249,115,22,0.15)] border border-[rgba(249,115,22,0.3)] flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white text-[13px] font-medium leading-tight">{f.title}</p>
                  <p className="text-[#6a9abf] text-[11px] mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Language switcher */}
          <div className="pt-4 border-t border-white/10">
            <AuthLanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>

      {/* ── Right column ──────────────────────────────────── */}
      <div className="flex-1 bg-[#F8F9FA] flex items-center justify-center p-6 min-h-screen">
        {/* Inner wrapper — stacks logo + card on mobile, just card on desktop */}
        <div className="w-full max-w-[340px] lg:max-w-sm">
          {/* Mobile logo */}
          <div className="md:hidden flex justify-center mb-8">
            <p className="text-2xl font-medium tracking-tight">
              <span className="text-[#1a3c5e]">firm</span>
              <span className="text-[#F97316]">iu</span>
            </p>
          </div>

          {/* Card — no border/shadow on mobile */}
          <div className="md:bg-white md:rounded-[16px] md:border md:border-[#E5E7EB]/50 md:p-8 md:shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
