import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface NosotrosPageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({ params: { locale } }: NosotrosPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: `${t("title")} — Firmiu`,
    description: t("subtitle"),
  };
}

export default async function NosotrosPage({ params: { locale } }: NosotrosPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  const whoItems = [
    t("who_1"),
    t("who_2"),
    t("who_3"),
    t("who_4"),
    t("who_5"),
  ];

  const values = [
    {
      title: t("value_1_title"),
      desc: t("value_1_desc"),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: t("value_2_title"),
      desc: t("value_2_desc"),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: t("value_3_title"),
      desc: t("value_3_desc"),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

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

      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

          {/* Misión */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1a3c5e] flex items-center justify-center text-white shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1a3c5e]">{t("mission_title")}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-[15px] pl-11">{t("mission_body")}</p>
          </section>

          {/* Para quién */}
          <section>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#1a3c5e] flex items-center justify-center text-white shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1a3c5e]">{t("for_who_title")}</h2>
            </div>
            <p className="text-gray-500 text-sm mb-5 pl-11">{t("for_who_subtitle")}</p>
            <ul className="pl-11 space-y-3">
              {whoItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#F97316] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Valores */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#1a3c5e] flex items-center justify-center text-white shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1a3c5e]">{t("values_title")}</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="bg-white rounded-[14px] border border-gray-100 shadow-sm p-5"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1a3c5e]/10 flex items-center justify-center text-[#1a3c5e] mb-3">
                    {v.icon}
                  </div>
                  <h3 className="font-semibold text-[#1a3c5e] mb-1">{v.title}</h3>
                  <p className="text-gray-500 text-[13px] leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
