import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ContactoPageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({ params: { locale } }: ContactoPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: `${t("title")} — Firmiu`,
    description: t("subtitle"),
  };
}

export default async function ContactoPage({ params: { locale } }: ContactoPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="bg-[#1a3c5e] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            <span className="text-white text-[11px] font-medium">Firmiu</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t("title")}</h1>
          <p className="text-[#94b8d4] text-lg">{t("subtitle")}</p>
        </div>
      </div>

      <main className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-[14px] border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">

          {/* Mail icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#1a3c5e]/10 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#1a3c5e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <p className="text-gray-500 text-[15px] mb-3">{t("body")}</p>

          <a
            href={`mailto:${t("email")}`}
            className="text-[#F97316] font-semibold text-xl hover:text-[#EA580C] transition-colors break-all"
          >
            {t("email")}
          </a>

          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-sm">
            <svg className="w-4 h-4 text-[#10B981] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t("response_time")}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
