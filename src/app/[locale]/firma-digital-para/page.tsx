import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { locales } from "@/i18n";
import { buildAlternates, buildOgLocale, APP_URL } from "@/lib/seo";
import { USE_CASES, getUseCaseContent, USE_CASE_ICON_PATHS as ICON_PATHS } from "@/lib/usecases";

interface PageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "usecase_hub" });
  const path = "/firma-digital-para";
  const ogImage = `${APP_URL}/api/og?title=${encodeURIComponent(t("title"))}`;

  return {
    title: t("meta_title"),
    description: t("meta_description"),
    keywords: t("meta_keywords"),
    alternates: buildAlternates(locale, path),
    openGraph: {
      title: t("meta_title"),
      description: t("meta_description"),
      url: `${APP_URL}${locale === "es" ? "" : `/${locale}`}${path}`,
      siteName: "Firmiu",
      ...buildOgLocale(locale),
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: t("title") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta_title"),
      description: t("meta_description"),
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function UseCaseHubPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "usecase_hub" });
  const prefix = locale === "es" ? "" : `/${locale}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "es" ? "Inicio" : "Home", item: `${APP_URL}${prefix || "/"}` },
      { "@type": "ListItem", position: 2, name: t("title"), item: `${APP_URL}${prefix}/firma-digital-para` },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <section className="bg-[#0f2640] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            {t("badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.1] mb-5">
            {t("title")}
          </h1>
          <p className="text-[#94b8d4] text-lg leading-relaxed max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
      </section>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          <div className="grid sm:grid-cols-2 gap-4">
            {USE_CASES.map((u) => {
              const uc = getUseCaseContent(u, locale);
              return (
                <Link
                  key={u.slug}
                  href={`${prefix}/firma-digital-para/${u.slug}`}
                  className="group bg-white rounded-[14px] border border-gray-100 shadow-sm p-5 hover:border-[#F97316]/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-[#F97316]/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={ICON_PATHS[u.icon]} />
                      </svg>
                    </div>
                    <h2 className="font-semibold text-[#1a3c5e]">{uc.name}</h2>
                  </div>
                  <p className="text-gray-500 text-[13px] leading-relaxed mb-3">{uc.intro}</p>
                  <span className="inline-flex items-center gap-1 text-[#F97316] text-[13px] font-medium">
                    {t("card_cta")}
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>

          <section className="bg-[#1a3c5e] rounded-[18px] p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{t("cta_title")}</h2>
            <p className="text-[#94b8d4] text-[15px] mb-6">{t("cta_subtitle")}</p>
            <Link
              href={`${prefix}/register`}
              className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-[11px] text-sm transition-colors"
            >
              {t("cta_button")}
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
