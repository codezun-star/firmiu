import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { locales } from "@/i18n";
import { buildAlternates, buildOgLocale, APP_URL } from "@/lib/seo";
import { BLOG_POSTS, getPost, getPostContent } from "@/lib/blog";

interface PageProps {
  params: { locale: string; slug: string };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    BLOG_POSTS.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params: { locale, slug } }: PageProps): Promise<Metadata> {
  const post = getPost(slug);
  if (!post) return {};

  const c = getPostContent(post, locale);
  const path = `/blog/${post.slug}`;
  const ogImage = `${APP_URL}/api/og?title=${encodeURIComponent(c.title)}`;

  return {
    title: `${c.title} | Firmiu`,
    description: c.excerpt,
    keywords: c.keywords,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title: c.title,
      description: c.excerpt,
      url: `${APP_URL}${locale === "es" ? "" : `/${locale}`}${path}`,
      siteName: "Firmiu",
      ...buildOgLocale(locale),
      type: "article",
      publishedTime: post.date,
      images: [{ url: ogImage, width: 1200, height: 630, alt: c.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.excerpt,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params: { locale, slug } }: PageProps) {
  setRequestLocale(locale);

  const post = getPost(slug);
  if (!post) notFound();

  const c = getPostContent(post, locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const prefix = locale === "es" ? "" : `/${locale}`;
  const path = `/blog/${post.slug}`;
  const pageUrl = `${APP_URL}${prefix}${path}`;
  const dateFmt = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: c.title,
        description: c.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: locale,
        mainEntityOfPage: pageUrl,
        url: pageUrl,
        image: `${APP_URL}/api/og?title=${encodeURIComponent(c.title)}`,
        author: { "@type": "Organization", name: "Firmiu", url: APP_URL },
        publisher: {
          "@type": "Organization",
          name: "Firmiu",
          logo: { "@type": "ImageObject", url: `${APP_URL}/api/logo` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: locale === "es" ? "Inicio" : "Home", item: `${APP_URL}${prefix || "/"}` },
          { "@type": "ListItem", position: 2, name: t("breadcrumb"), item: `${APP_URL}${prefix}/blog` },
          { "@type": "ListItem", position: 3, name: c.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <nav className="text-[12px] text-gray-400 mb-6" aria-label="Breadcrumb">
            <Link href={`${prefix}/blog`} className="hover:text-[#1a3c5e] transition-colors">
              {t("breadcrumb")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-500">{c.title}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#1a3c5e] tracking-tight leading-tight mb-4">
            {c.title}
          </h1>
          <div className="flex items-center gap-3 text-[13px] text-gray-400 mb-10 pb-8 border-b border-gray-200">
            <time dateTime={post.date}>{dateFmt.format(new Date(post.date))}</time>
            <span>·</span>
            <span>{t("read_time", { min: c.readingMinutes })}</span>
          </div>

          <div className="space-y-8">
            {c.sections.map((section, i) => (
              <section key={i}>
                {section.heading && (
                  <h2 className="text-xl font-bold text-[#1a3c5e] mb-3">{section.heading}</h2>
                )}
                <div className="space-y-4">
                  {section.paragraphs.map((p, j) => (
                    <p key={j} className="text-[15px] text-gray-700 leading-relaxed">{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-[#1a3c5e] rounded-[18px] p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{t("cta_title")}</h2>
            <p className="text-[#94b8d4] text-[15px] mb-6">{t("cta_subtitle")}</p>
            <Link
              href={`${prefix}/register`}
              className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-[11px] text-sm transition-colors"
            >
              {t("cta_button")}
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link href={`${prefix}/blog`} className="inline-flex items-center gap-1.5 text-[#1a3c5e] hover:text-[#F97316] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              {t("back")}
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
