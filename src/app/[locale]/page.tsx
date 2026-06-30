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
import { buildAlternates, buildOgLocale } from "@/lib/seo";

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
  es: "Firma documentos PDF en segundos. Envía a clientes para firma digital con validez legal en México, Colombia, Argentina, Chile, Perú, Costa Rica y toda Latinoamérica. Sin impresoras ni escáneres. Gratis para empezar.",
  en: "Sign PDF documents in seconds. Send to clients for legally valid digital signatures across Latin America — Mexico, Colombia, Argentina, Chile, Peru, Costa Rica and more. No printers or scanners. Free to start.",
};

const keywords: Record<string, string> = {
  es: "firma digital, firma electrónica, firmar PDF online, firma digital latinoamerica, firma electrónica México, firma electrónica Colombia, firma electrónica Argentina, firma electrónica Chile, firma electrónica Perú, firma electrónica Costa Rica, firma electrónica Guatemala, firma electrónica Ecuador, firma electrónica Honduras, firma digital contrato, firmar documentos online, firma digital gratis, firma digital PDF, firma electrónica legal, firma digital para contadores, firma digital para abogados, firma digital para inmobiliarias, firma electrónica sin imprimir, firma digital empresas LATAM",
  en: "digital signature, electronic signature, sign PDF online, digital signature Latin America, e-signature Mexico, e-signature Colombia, e-signature Argentina, e-signature Chile, digital signature software LATAM, sign documents online, legally valid digital signatures, digital signature for lawyers, digital signature for accountants, e-signature real estate, paperless document signing, free digital signature",
};

function buildOgImageUrl(baseUrl: string, title: string): string {
  return `${baseUrl}/api/og?title=${encodeURIComponent(title)}`;
}

export async function generateMetadata({ params: { locale } }: HomePageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";
  const canonicalUrl = locale === "es" ? baseUrl : `${baseUrl}/${locale}`;
  const title = titles[locale] ?? titles.es;
  const ogImage = buildOgImageUrl(baseUrl, title);

  return {
    title,
    description: descriptions[locale] ?? descriptions.es,
    keywords: keywords[locale] ?? keywords.es,
    alternates: buildAlternates(locale, ""),
    openGraph: {
      title,
      description: descriptions[locale] ?? descriptions.es,
      url: canonicalUrl,
      siteName: "Firmiu",
      ...buildOgLocale(locale),
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descriptions[locale] ?? descriptions.es,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

const LATAM_COUNTRIES = [
  "México", "Colombia", "Argentina", "Chile", "Perú", "Costa Rica",
  "Guatemala", "Ecuador", "Honduras", "El Salvador", "Bolivia",
  "Paraguay", "Uruguay", "Panamá", "República Dominicana", "Nicaragua",
  "Venezuela", "Cuba",
];

export default async function HomePage({ params: { locale } }: HomePageProps) {
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home.faq" });
  const faqPairs = Array.from({ length: 10 }, (_, i) => ({
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
        logo: `${baseUrl}/api/logo`,
        description: descriptions[locale] ?? descriptions.es,
        foundingDate: "2024",
        areaServed: LATAM_COUNTRIES.map((name) => ({
          "@type": "Country",
          name,
        })),
        availableLanguage: ["Spanish", "English"],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "soporte@firmiu.com",
          availableLanguage: ["Spanish", "English"],
        },
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "Firmiu",
        publisher: { "@id": `${baseUrl}/#organization` },
        inLanguage: locale === "es" ? "es" : "en",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${canonicalUrl}/#software`,
        name: "Firmiu",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Document Management",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        inLanguage: ["es", "en"],
        availableOnDevice: "Desktop, Mobile, Tablet",
        offers: [
          {
            "@type": "Offer",
            name: locale === "es" ? "Plan Gratuito" : "Free Plan",
            price: "0",
            priceCurrency: "USD",
            description: locale === "es" ? "3 documentos por mes, sin tarjeta de crédito" : "3 documents per month, no credit card required",
            eligibleRegion: LATAM_COUNTRIES.map((name) => ({ "@type": "Country", name })),
          },
          {
            "@type": "Offer",
            name: "Starter",
            price: "15",
            priceCurrency: "USD",
            description: locale === "es" ? "30 documentos por mes" : "30 documents per month",
            billingIncrement: 1,
            priceSpecification: { "@type": "UnitPriceSpecification", unitCode: "MON" },
            eligibleRegion: LATAM_COUNTRIES.map((name) => ({ "@type": "Country", name })),
          },
          {
            "@type": "Offer",
            name: "Pro",
            price: "29",
            priceCurrency: "USD",
            description: locale === "es" ? "60 documentos por mes" : "60 documents per month",
            billingIncrement: 1,
            priceSpecification: { "@type": "UnitPriceSpecification", unitCode: "MON" },
            eligibleRegion: LATAM_COUNTRIES.map((name) => ({ "@type": "Country", name })),
          },
          // Business plan is hidden for now (not offered yet) — no Offer listed.
        ],
        description: descriptions[locale] ?? descriptions.es,
        featureList: locale === "es"
          ? [
              "Firma digital con validez legal en Latinoamérica",
              "Audit trail completo (IP, dispositivo, ubicación)",
              "Firma desde móvil con canvas táctil",
              "Verificación por código de 4 dígitos",
              "PDFs firmados con pdf-lib",
              "Almacenamiento cifrado AES-256",
            ]
          : [
              "Legally valid digital signatures in Latin America",
              "Full audit trail (IP, device, location)",
              "Mobile signing with touch canvas",
              "4-digit code verification",
              "Signed PDFs with pdf-lib",
              "AES-256 encrypted storage",
            ],
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
