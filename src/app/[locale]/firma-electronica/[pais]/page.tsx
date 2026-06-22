import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { locales } from "@/i18n";
import { buildAlternates, buildOgLocale, APP_URL } from "@/lib/seo";
import {
  COUNTRIES,
  getCountry,
  getCountryContent,
} from "@/lib/countries";

interface PageProps {
  params: { locale: string; pais: string };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    COUNTRIES.map((country) => ({ locale, pais: country.slug }))
  );
}

export async function generateMetadata({
  params: { locale, pais },
}: PageProps): Promise<Metadata> {
  const country = getCountry(pais);
  if (!country) return {};

  const content = getCountryContent(country, locale);
  const t = await getTranslations({ locale, namespace: "country_page" });
  const path = `/firma-electronica/${country.slug}`;
  const title = t("meta_title", { country: content.name });
  const description = t("meta_description", {
    country: content.name,
    law: content.lawName,
  });
  const ogImage = `${APP_URL}/api/og?title=${encodeURIComponent(
    t("h1", { country: content.name })
  )}`;

  return {
    title,
    description,
    keywords: t("meta_keywords", { country: content.name }),
    alternates: buildAlternates(locale, path),
    openGraph: {
      title,
      description,
      url: `${APP_URL}${locale === "es" ? "" : `/${locale}`}${path}`,
      siteName: "Firmiu",
      ...buildOgLocale(locale),
      type: "article",
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

export default async function CountryPage({ params: { locale, pais } }: PageProps) {
  setRequestLocale(locale);

  const country = getCountry(pais);
  if (!country) notFound();

  const content = getCountryContent(country, locale);
  const t = await getTranslations({ locale, namespace: "country_page" });
  const prefix = locale === "es" ? "" : `/${locale}`;
  const path = `/firma-electronica/${country.slug}`;
  const pageUrl = `${APP_URL}${prefix}${path}`;

  const steps = [
    { title: t("how_step1_title"), desc: t("how_step1_desc") },
    { title: t("how_step2_title"), desc: t("how_step2_desc") },
    { title: t("how_step3_title"), desc: t("how_step3_desc") },
  ];

  const otherCountries = COUNTRIES.filter((c) => c.slug !== country.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t("breadcrumb_home"),
            item: `${APP_URL}${prefix || "/"}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t("breadcrumb_hub"),
            item: `${APP_URL}${prefix}/firma-electronica`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: content.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
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
          <nav className="text-[12px] text-[#6a9abf] mb-5" aria-label="Breadcrumb">
            <Link href={`${prefix}/firma-electronica`} className="hover:text-white transition-colors">
              {t("breadcrumb_hub")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#94b8d4]">{content.name}</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <span className="text-base leading-none">{country.flag}</span>
            {t("badge", { country: content.name })}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.1] mb-5">
            {t("h1", { country: content.name })}
          </h1>
          <p className="text-[#94b8d4] text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {content.intro}
          </p>
          <Link
            href={`${prefix}/register`}
            className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-[11px] text-sm transition-colors"
          >
            {t("cta_button")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

          {/* Legal framework */}
          <section>
            <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[#F97316] mb-2">
              {t("legal_label")}
            </span>
            <h2 className="text-2xl font-bold text-[#1a3c5e] mb-4">
              {t("legal_title", { country: content.name })}
            </h2>
            <p className="text-gray-600 leading-relaxed text-[15px] mb-4">{content.legalBody}</p>
            <div className="bg-white rounded-[14px] border border-gray-100 shadow-sm p-5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1a3c5e]/10 flex items-center justify-center text-[#1a3c5e] shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
                  {t("legal_label")}
                </p>
                <p className="text-[15px] font-semibold text-[#1a3c5e]">{content.lawName}</p>
              </div>
            </div>
          </section>

          {/* Validity */}
          <section>
            <h2 className="text-2xl font-bold text-[#1a3c5e] mb-4">
              {t("validity_title", { country: content.name })}
            </h2>
            <p className="text-gray-600 leading-relaxed text-[15px]">{content.validity}</p>
          </section>

          {/* How it works */}
          <section>
            <h2 className="text-2xl font-bold text-[#1a3c5e] mb-6">
              {t("how_title", { country: content.name })}
            </h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {steps.map((step, i) => (
                <div key={i} className="bg-white rounded-[14px] border border-gray-100 shadow-sm p-5">
                  <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center text-white font-bold text-sm mb-3">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-[#1a3c5e] mb-1 text-[15px]">{step.title}</h3>
                  <p className="text-gray-500 text-[13px] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-[#1a3c5e] mb-6">{t("faq_title")}</h2>
            <dl className="space-y-3">
              {content.faqs.map((f, i) => (
                <details key={i} className="group bg-white rounded-[14px] border border-[#E5E7EB] overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none">
                    <dt className="text-[14px] font-semibold text-[#111827]">{f.q}</dt>
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#F0F7FF] flex items-center justify-center text-[#1a3c5e] transition-transform duration-200 group-open:rotate-45">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </summary>
                  <dd className="px-5 pb-4 text-[14px] text-[#4B5563] leading-relaxed border-t border-[#F3F4F6] pt-3">
                    {f.a}
                  </dd>
                </details>
              ))}
            </dl>
          </section>

          {/* Other countries — internal linking */}
          <section>
            <h2 className="text-xl font-bold text-[#1a3c5e] mb-5">{t("other_title")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {otherCountries.map((c) => {
                const cc = getCountryContent(c, locale);
                return (
                  <Link
                    key={c.slug}
                    href={`${prefix}/firma-electronica/${c.slug}`}
                    className="flex items-center gap-2.5 bg-white rounded-[11px] border border-gray-100 shadow-sm px-4 py-3 hover:border-[#F97316]/40 hover:shadow transition-all"
                  >
                    <span className="text-lg leading-none">{c.flag}</span>
                    <span className="text-[14px] font-medium text-[#1a3c5e]">{cc.name}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[#1a3c5e] rounded-[18px] p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              {t("cta_title", { country: content.name })}
            </h2>
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
