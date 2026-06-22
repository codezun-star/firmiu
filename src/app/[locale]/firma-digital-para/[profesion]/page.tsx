import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { locales } from "@/i18n";
import { buildAlternates, buildOgLocale, APP_URL } from "@/lib/seo";
import {
  USE_CASES,
  getUseCase,
  getUseCaseContent,
  USE_CASE_ICON_PATHS as ICON_PATHS,
} from "@/lib/usecases";

interface PageProps {
  params: { locale: string; profesion: string };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    USE_CASES.map((u) => ({ locale, profesion: u.slug }))
  );
}

export async function generateMetadata({
  params: { locale, profesion },
}: PageProps): Promise<Metadata> {
  const useCase = getUseCase(profesion);
  if (!useCase) return {};

  const content = getUseCaseContent(useCase, locale);
  const path = `/firma-digital-para/${useCase.slug}`;
  const ogImage = `${APP_URL}/api/og?title=${encodeURIComponent(content.h1)}`;

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: `${APP_URL}${locale === "es" ? "" : `/${locale}`}${path}`,
      siteName: "Firmiu",
      ...buildOgLocale(locale),
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: content.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function UseCasePage({ params: { locale, profesion } }: PageProps) {
  setRequestLocale(locale);

  const useCase = getUseCase(profesion);
  if (!useCase) notFound();

  const content = getUseCaseContent(useCase, locale);
  const t = await getTranslations({ locale, namespace: "usecase_page" });
  const tc = await getTranslations({ locale, namespace: "country_page" });
  const prefix = locale === "es" ? "" : `/${locale}`;
  const path = `/firma-digital-para/${useCase.slug}`;
  const pageUrl = `${APP_URL}${prefix}${path}`;

  const steps = [
    { title: tc("how_step1_title"), desc: tc("how_step1_desc") },
    { title: tc("how_step2_title"), desc: tc("how_step2_desc") },
    { title: tc("how_step3_title"), desc: tc("how_step3_desc") },
  ];

  const others = USE_CASES.filter((u) => u.slug !== useCase.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: tc("breadcrumb_home"), item: `${APP_URL}${prefix || "/"}` },
          { "@type": "ListItem", position: 2, name: t("breadcrumb_hub"), item: `${APP_URL}${prefix}/firma-digital-para` },
          { "@type": "ListItem", position: 3, name: content.name, item: pageUrl },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0f2640] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <nav className="text-[12px] text-[#6a9abf] mb-5" aria-label="Breadcrumb">
            <Link href={`${prefix}/firma-digital-para`} className="hover:text-white transition-colors">
              {t("breadcrumb_hub")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#94b8d4]">{content.name}</span>
          </nav>
          <div className="w-14 h-14 rounded-2xl bg-[#F97316]/15 border border-[#F97316]/25 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={ICON_PATHS[useCase.icon]} />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.1] mb-5">
            {content.h1}
          </h1>
          <p className="text-[#94b8d4] text-lg leading-relaxed mb-8 max-w-2xl mx-auto">{content.intro}</p>
          <Link
            href={`${prefix}/register`}
            className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-[11px] text-sm transition-colors"
          >
            {tc("cta_button")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

          {/* Uses */}
          <section>
            <h2 className="text-2xl font-bold text-[#1a3c5e] mb-5">{t("uses_title")}</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {content.uses.map((u) => (
                <li key={u} className="flex items-center gap-3 bg-white rounded-[11px] border border-gray-100 shadow-sm px-4 py-3 text-[14px] text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {u}
                </li>
              ))}
            </ul>
          </section>

          {/* Benefits */}
          <section>
            <h2 className="text-2xl font-bold text-[#1a3c5e] mb-6">{t("benefits_title")}</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {content.benefits.map((b) => (
                <div key={b.title} className="bg-white rounded-[14px] border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-[#1a3c5e] mb-1 text-[15px]">{b.title}</h3>
                  <p className="text-gray-500 text-[13px] leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section>
            <h2 className="text-2xl font-bold text-[#1a3c5e] mb-6">{t("how_title")}</h2>
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
            <h2 className="text-2xl font-bold text-[#1a3c5e] mb-6">{tc("faq_title")}</h2>
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

          {/* Other professions */}
          <section>
            <h2 className="text-xl font-bold text-[#1a3c5e] mb-5">{t("other_title")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {others.map((u) => {
                const uc = getUseCaseContent(u, locale);
                return (
                  <Link
                    key={u.slug}
                    href={`${prefix}/firma-digital-para/${u.slug}`}
                    className="flex items-center gap-2.5 bg-white rounded-[11px] border border-gray-100 shadow-sm px-4 py-3 hover:border-[#F97316]/40 hover:shadow transition-all"
                  >
                    <svg className="w-4 h-4 text-[#F97316] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={ICON_PATHS[u.icon]} />
                    </svg>
                    <span className="text-[14px] font-medium text-[#1a3c5e]">{uc.name}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[#1a3c5e] rounded-[18px] p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{t("cta_title")}</h2>
            <p className="text-[#94b8d4] text-[15px] mb-6">{tc("cta_subtitle")}</p>
            <Link
              href={`${prefix}/register`}
              className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-[11px] text-sm transition-colors"
            >
              {tc("cta_button")}
            </Link>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
