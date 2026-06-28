import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { locales } from "@/i18n";
import type { Locale } from "@/i18n";
import Toaster from "@/components/Toaster";
import ConsentBanner from "@/components/ConsentBanner";
import MaintenanceBanner from "@/components/MaintenanceBanner";

// Google Consent Mode v2 — default everything to "denied" before gtag.js
// loads, so no analytics/ads cookies are set until the visitor opts in.
const CONSENT_DEFAULT = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
  gtag('js', new Date());
`;

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  if (!locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Consent Mode defaults must run before gtag.js — inline in <head>. */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT }} />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <MaintenanceBanner />
          {children}
          <Toaster />
          <ConsentBanner />
        </NextIntlClientProvider>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9WDRMFRCCB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`gtag('config', 'G-9WDRMFRCCB');`}
        </Script>
      </body>
    </html>
  );
}
