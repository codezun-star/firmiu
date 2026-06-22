import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { locales } from "@/i18n";
import { buildAlternates, buildOgLocale, APP_URL } from "@/lib/seo";
import { sortedPosts, getPostContent } from "@/lib/blog";

interface PageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "blog" });
  const path = "/blog";
  const ogImage = `${APP_URL}/api/og?title=${encodeURIComponent(t("meta_title"))}`;

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
      images: [{ url: ogImage, width: 1200, height: 630, alt: t("meta_title") }],
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

export default async function BlogIndexPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const prefix = locale === "es" ? "" : `/${locale}`;
  const posts = sortedPosts();
  const dateFmt = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Firmiu",
    url: `${APP_URL}${prefix}/blog`,
    inLanguage: locale,
    blogPost: posts.map((p) => {
      const c = getPostContent(p, locale);
      return {
        "@type": "BlogPosting",
        headline: c.title,
        datePublished: p.date,
        url: `${APP_URL}${prefix}/blog/${p.slug}`,
      };
    }),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <section className="bg-[#0f2640] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.1] mb-4">
            {t("title")}
          </h1>
          <p className="text-[#94b8d4] text-lg leading-relaxed max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
      </section>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-5">
            {posts.map((p) => {
              const c = getPostContent(p, locale);
              return (
                <Link
                  key={p.slug}
                  href={`${prefix}/blog/${p.slug}`}
                  className="group block bg-white rounded-[14px] border border-gray-100 shadow-sm p-6 hover:border-[#F97316]/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 text-[12px] text-gray-400 mb-2">
                    <time dateTime={p.date}>{dateFmt.format(new Date(p.date))}</time>
                    <span>·</span>
                    <span>{t("read_time", { min: c.readingMinutes })}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1a3c5e] mb-2 group-hover:text-[#15304d] transition-colors">
                    {c.title}
                  </h2>
                  <p className="text-gray-500 text-[14px] leading-relaxed mb-3">{c.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-[#F97316] text-[13px] font-medium">
                    {t("read_article")}
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
