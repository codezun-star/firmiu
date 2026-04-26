import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Firmiu — Firma digital de documentos",
  description: "Envía PDFs para firma digital. Rápido, seguro y sin papel.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com"),
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
