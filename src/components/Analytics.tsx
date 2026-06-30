"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_ID = "G-9WDRMFRCCB";

// Routes where Google Analytics must NOT load:
//  - /firmar/[token] → the URL carries the signing token (a capability secret);
//    loading GA would send that URL to Google. The token alone allows downloading
//    the final signed PDF, so it must never leave to a third party.
//  - /dashboard      → private, authenticated area (also noindex).
const NO_ANALYTICS = ["/firmar", "/dashboard"];

export default function Analytics() {
  // usePathname() returns the real path including the /en locale prefix; strip it
  // so "/en/firmar/..." is matched the same as "/firmar/...".
  const pathname = usePathname() ?? "";
  const path = pathname.replace(/^\/en(?=\/|$)/, "");
  const blocked = NO_ANALYTICS.some((p) => path === p || path.startsWith(`${p}/`));

  if (blocked) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
