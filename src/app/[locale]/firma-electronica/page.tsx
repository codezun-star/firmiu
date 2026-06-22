import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { locales } from "@/i18n";
import { buildAlternates, buildOgLocale, APP_URL } from "@/lib/seo";
import { COUNTRIES, getCountryContent, type CountryRegion } from "@/lib/countries";

interface PageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "country_hub" });
  const path = "/firma-electronica";
  const title = t("meta_title");
  const description = t("meta_description");
  const ogImage = `${APP_URL}/api/og?title=${encodeURIComponent(t("title"))}`;

  return {
    title,
    description,
    keywords: t("meta_keywords"),
    alternates: buildAlternates(locale, path),
    openGraph: {
      title,
      description,
      url: `${APP_URL}${locale === "es" ? "" : `/${locale}`}${path}`,
      siteName: "Firmiu",
      ...buildOgLocale(locale),
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function CountryHubPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "country_hub" });
  const prefix = locale === "es" ? "" : `/${locale}`;

  const regions: { key: CountryRegion; title: string }[] = [
    { key: "latam", title: t("latam_title") },
    { key: "europe", title: t("europe_title") },
    { key: "north-america", title: t("north_america_title") },
    { key: "asia", title: t("asia_title") },
    { key: "oceania", title: t("oceania_title") },
    { key: "africa", title: t("africa_title") },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "es" ? "Inicio" : "Home", item: `${APP_URL}${prefix || "/"}` },
      { "@type": "ListItem", position: 2, name: t("title"), item: `${APP_URL}${prefix}/firma-electronica` },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0f2640] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            {t("badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.1] mb-5">
            {t("title")}
          </h1>
          <p className="text-[#94b8d4] text-lg leading-relaxed max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          {regions.map((region) => {
            const countries = COUNTRIES.filter((c) => c.region === region.key);
            if (countries.length === 0) return null;
            return (
              <section key={region.key}>
                <h2 className="text-xl font-bold text-[#1a3c5e] mb-5">{region.title}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {countries.map((c) => {
                    const cc = getCountryContent(c, locale);
                    return (
                      <Link
                        key={c.slug}
                        href={`${prefix}/firma-electronica/${c.slug}`}
                        className="group bg-white rounded-[14px] border border-gray-100 shadow-sm p-5 hover:border-[#F97316]/40 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl leading-none">{c.flag}</span>
                          <h3 className="font-semibold text-[#1a3c5e]">{cc.name}</h3>
                        </div>
                        <p className="text-gray-500 text-[13px] leading-relaxed mb-3">{cc.summary}</p>
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
              </section>
            );
          })}

          {/* CTA */}
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
