import type { Metadata } from "next";
import { buildAlternates, buildOgLocale } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCards from "@/components/landing/PricingCards";
import PricingTable from "@/components/landing/PricingTable";

interface PreciosPageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({ params: { locale } }: PreciosPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "pricing_page" });
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";
  const prefix = locale === "es" ? "" : `/${locale}`;
  const title = `${t("meta_title")} — Firmiu`;
  const description = t("meta_description");
  const ogImage = `${base}/api/og?title=${encodeURIComponent(t("meta_title"))}`;
  return {
    title,
    description,
    keywords: t("meta_keywords"),
    alternates: buildAlternates(locale, "/precios"),
    openGraph: {
      title,
      description,
      url: `${base}${prefix}/precios`,
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

export default async function PreciosPage({ params: { locale } }: PreciosPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pricing_page" });
  const tp = await getTranslations({ locale, namespace: "home.pricing" });

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";
  const prefix = locale === "es" ? "" : `/${locale}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "es" ? "Inicio" : "Home", item: locale === "es" ? base : `${base}/en` },
      { "@type": "ListItem", position: 2, name: t("meta_title"), item: `${base}${prefix}/precios` },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Navbar />

      {/* Hero */}
      <div className="bg-[#1a3c5e] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            <span className="text-white text-[11px] font-medium">{tp("title")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t("title")}</h1>
          <p className="text-[#94b8d4] text-lg">{t("subtitle")}</p>
        </div>
      </div>

      <main className="flex-1 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Plan cards */}
          <PricingCards locale={locale} />

          <p className="text-center text-xs text-[#9CA3AF] mt-5 max-w-2xl mx-auto leading-relaxed">
            {tp("per_send_note")}
          </p>

          {/* Detailed comparison table */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">{t("compare_title")}</h2>
              <p className="text-[#6B7280] text-sm">{t("compare_subtitle")}</p>
            </div>
            <div className="bg-white rounded-2xl border-[0.5px] border-[#E5E7EB] p-4 sm:p-6">
              <PricingTable />
            </div>
          </div>

          {/* Need more volume than Pro → contact (replaces the Business plan for now) */}
          <div className="mt-10 rounded-2xl border-[0.5px] border-[#E5E7EB] bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-semibold text-[#111827]">{t("more_volume_title")}</p>
              <p className="text-sm text-[#6B7280] mt-1">{t("more_volume_desc")}</p>
            </div>
            <a
              href="mailto:codezun@gmail.com"
              className="shrink-0 inline-flex items-center gap-2 bg-[#1a3c5e] hover:bg-[#15304d] text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {t("more_volume_cta")}
            </a>
          </div>

          {/* Final CTA */}
          <div className="mt-10 bg-[#1a3c5e] rounded-2xl px-6 py-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t("cta_title")}</h2>
            <p className="text-[#94b8d4] text-sm mb-6">{t("cta_subtitle")}</p>
            <Link
              href={`${prefix}/register`}
              className="inline-block bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold px-6 py-3 rounded-[10px] transition-colors"
            >
              {t("cta_button")}
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
