import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";
const defaultOgImage = `${baseUrl}/api/og?title=Firma+Digital+para+Latinoam%C3%A9rica`;

export const metadata: Metadata = {
  title: "Firmiu — Digital Document Signing",
  description:
    "Send PDFs for digital signature. Fast, secure, and paperless. Legally valid across Latin America.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    siteName: "Firmiu",
    type: "website",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: "Firmiu — Firma Digital para Latinoamérica" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [defaultOgImage],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
  other: {
    "geo.region": "CR",
    "geo.placename": "San José, Costa Rica",
    "geo.position": "9.9281;-84.0907",
    ICBM: "9.9281, -84.0907",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9WDRMFRCCB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9WDRMFRCCB');
          `}
        </Script>
      </body>
    </html>
  );
}
