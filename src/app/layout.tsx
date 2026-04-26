import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Firmiu — Digital Document Signing",
  description: "Send PDFs for digital signature. Fast, secure, and paperless. Legally valid across Latin America.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com"),
  openGraph: {
    siteName: "Firmiu",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
