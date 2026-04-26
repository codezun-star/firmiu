import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface TerminosPageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({ params: { locale } }: TerminosPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "terms" });
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";
  const prefix = locale === "es" ? "" : `/${locale}`;
  return {
    title: `${t("title")} — Firmiu`,
    description: t("meta_description"),
    keywords: t("meta_keywords"),
    alternates: {
      canonical: `${base}${prefix}/terminos`,
      languages: { es: `${base}/terminos`, en: `${base}/en/terminos` },
    },
    openGraph: {
      title: `${t("title")} — Firmiu`,
      description: t("meta_description"),
      url: `${base}${prefix}/terminos`,
      siteName: "Firmiu",
      locale: locale === "es" ? "es_419" : "en_US",
      type: "website",
    },
    twitter: { card: "summary", title: `${t("title")} — Firmiu`, description: t("meta_description") },
    robots: { index: true, follow: true },
  };
}

export default function TerminosPage({ params: { locale } }: TerminosPageProps) {
  setRequestLocale(locale);
  const t = useTranslations("terms");

  const prefix = locale === "en" ? "/en" : "";

  const sections = Array.from({ length: 13 }, (_, i) => ({
    title: t(`s${i + 1}_title` as Parameters<typeof t>[0]),
    body:  t(`s${i + 1}_body`  as Parameters<typeof t>[0]),
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page header */}
      <div className="bg-[#1a3c5e] py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-4">
            <svg className="w-3.5 h-3.5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[14px] p-5 mb-8 flex gap-3">
            <svg className="w-5 h-5 text-[#1a3c5e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[14px] text-[#1e40af] leading-relaxed">{t("intro")}</p>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {sections.map((section, i) => (
              <div
                key={i}
                className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB] p-6"
              >
                <h2 className="text-[15px] font-semibold text-[#1a3c5e] mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[10px] font-bold text-[#1a3c5e] shrink-0">
                    {i + 1}
                  </span>
                  {section.title.replace(/^\d+\.\s*/, "")}
                </h2>
                <p className="text-[14px] text-[#4B5563] leading-relaxed">
                  {section.body}
                  {i === 12 && (
                    <Link
                      href={`${prefix}/reembolsos`}
                      className="ml-1 text-[#F97316] hover:text-[#EA580C] underline underline-offset-2 transition-colors"
                    >
                      →
                    </Link>
                  )}
                </p>
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
              <p className="text-white font-semibold text-[14px] mb-1">{t("s12_title")}</p>
              <p className="text-[#94b8d4] text-[13px] leading-relaxed">{t("s12_body")}</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
