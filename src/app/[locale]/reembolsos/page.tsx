import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ReembolsosPageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({ params: { locale } }: ReembolsosPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "refund" });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";
  const prefix = locale === "es" ? "" : `/${locale}`;

  return {
    title: `${t("title")} — Firmiu`,
    description: t("intro"),
    alternates: {
      canonical: `${baseUrl}${prefix}/reembolsos`,
      languages: {
        es: `${baseUrl}/reembolsos`,
        en: `${baseUrl}/en/reembolsos`,
      },
    },
  };
}

export default async function ReembolsosPage({ params: { locale } }: ReembolsosPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "refund" });

  const sections = [
    { title: t("s1_title"), body: t("s1_body") },
    { title: t("s2_title"), body: t("s2_body") },
    { title: t("s3_title"), body: t("s3_body") },
    { title: t("s4_title"), body: t("s4_body") },
  ];

  const icons = [
    // 1. General Policy — shield check
    <svg key="s1" className="w-5 h-5 text-[#F97316] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>,
    // 2. Refunds — credit card
    <svg key="s2" className="w-5 h-5 text-[#F97316] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>,
    // 3. Cancellations — x circle
    <svg key="s3" className="w-5 h-5 text-[#F97316] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>,
    // 4. Exceptions — exclamation circle
    <svg key="s4" className="w-5 h-5 text-[#F97316] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>,
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page header */}
      <div className="bg-[#1a3c5e] py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-4">
            <svg className="w-3.5 h-3.5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-white text-[11px] font-medium">firmiu.com</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
          <p className="text-[#94b8d4] text-sm">{t("updated")}</p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 bg-[#F9FAFB]">
        <div className="max-w-3xl mx-auto px-4 py-10">

          {/* Intro */}
          <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-[14px] p-5 mb-8 flex gap-3">
            <svg className="w-5 h-5 text-[#F97316] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[14px] text-[#92400E] leading-relaxed">{t("intro")}</p>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {sections.map((section, i) => (
              <div
                key={i}
                className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-6"
              >
                <h2 className="text-[15px] font-semibold text-[#1a3c5e] mb-3 flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center shrink-0">
                    {icons[i]}
                  </span>
                  {section.title.replace(/^\d+\.\s*/, "")}
                </h2>
                <p className="text-[14px] text-[#4B5563] leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>

          {/* Contact card */}
          <div className="mt-8 bg-[#1a3c5e] rounded-[14px] p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-[14px] mb-1">{t("contact_label")}</p>
              <p className="text-[#94b8d4] text-[13px]">{t("contact_email")}</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
