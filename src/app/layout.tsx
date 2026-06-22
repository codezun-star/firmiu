import type { Metadata, Viewport } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";
const defaultOgImage = `${baseUrl}/api/og?title=Firma+Digital+para+Latinoam%C3%A9rica`;

/**
 * Root layout — passthrough.
 *
 * The actual <html>/<body> are rendered by `app/[locale]/layout.tsx` (so the
 * `lang` attribute always reflects the active locale) and by the global
 * `app/not-found.tsx`. Rendering them here too would produce nested <html>
 * tags and strip the language signal at the document root.
 *
 * Metadata still lives here because Next.js collects metadata exports from any
 * layout in the tree, regardless of whether it renders markup.
 */
export const metadata: Metadata = {
  title: "Firmiu — Firma Digital de Documentos",
  description:
    "Envía PDFs para firma digital. Rápido, seguro y sin papel. Con validez legal en toda Latinoamérica, España y EE. UU.",
  metadataBase: new URL(baseUrl),
  applicationName: "Firmiu",
  manifest: "/manifest.webmanifest",
  openGraph: {
    siteName: "Firmiu",
    type: "website",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Firmiu — Firma Digital para Latinoamérica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [defaultOgImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1a3c5e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
