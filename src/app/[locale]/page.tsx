import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import InContext from "@/components/landing/InContext";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CtaBanner from "@/components/landing/CtaBanner";
import { locales } from "@/i18n";

interface HomePageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const titles: Record<string, string> = {
  es: "Firmiu — Firma Digital de Documentos para Latinoamérica",
  en: "Firmiu — Digital Document Signing for Latin America",
};

const descriptions: Record<string, string> = {
  es: "Firma documentos PDF en segundos. Envía a clientes para firma digital con validez legal en Latinoamérica. Sin impresoras ni escáneres. Gratis para empezar.",
  en: "Sign PDF documents in seconds. Send to clients for legally valid digital signatures across Latin America. No printers or scanners. Free to start.",
};

const keywords: Record<string, string> = {
  es: "firma digital, firma electrónica, firmar PDF online, firma digital latinoamerica, firma electrónica Costa Rica, firma electrónica Colombia, firma electrónica México, firmar documentos online, firma digital contrato, firma digital gratis",
  en: "digital signature, electronic signature, sign PDF online, digital signature Latin America, e-signature software, document signing, sign documents online",
};

export async function generateMetadata({ params: { locale } }: HomePageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";
  const canonicalUrl = locale === "es" ? baseUrl : `${baseUrl}/${locale}`;

  return {
    title: titles[locale] ?? titles.es,
    description: descriptions[locale] ?? descriptions.es,
    keywords: keywords[locale] ?? keywords.es,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: baseUrl,
        en: `${baseUrl}/en`,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title: titles[locale] ?? titles.es,
      description: descriptions[locale] ?? descriptions.es,
      url: canonicalUrl,
      siteName: "Firmiu",
      locale: locale === "es" ? "es_419" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_419"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] ?? titles.es,
      description: descriptions[locale] ?? descriptions.es,
    },
    robots: { index: true, follow: true },
  };
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home.faq" });
  const faqPairs = Array.from({ length: 8 }, (_, i) => ({
    q: t(`q${i + 1}` as Parameters<typeof t>[0]),
    a: t(`a${i + 1}` as Parameters<typeof t>[0]),
  }));

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";
  const canonicalUrl = locale === "es" ? baseUrl : `${baseUrl}/${locale}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "Firmiu",
        url: baseUrl,
        description: descriptions[locale] ?? descriptions.es,
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "Firmiu",
        publisher: { "@id": `${baseUrl}/#organization` },
        inLanguage: locale === "es" ? "es" : "en",
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/register`,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${canonicalUrl}/#software`,
        name: "Firmiu",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: locale === "es" ? "Plan gratuito — 3 documentos/mes" : "Free plan — 3 documents/month",
        },
        description: descriptions[locale] ?? descriptions.es,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqPairs.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Hero locale={locale} />
          <HowItWorks />
          <Features />
          <InContext />
          <Pricing locale={locale} />
          <Testimonials />
          <FAQ />
          <CtaBanner locale={locale} />
        </main>
        <Footer />
      </div>
    </>
  );
}
