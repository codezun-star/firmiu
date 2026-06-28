"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

// Toggle/message via NEXT_PUBLIC_MAINTENANCE_BANNER (inlined at build → redeploy to change):
//   unset | "" | "false" | "0"  → off
//   "true" | "1"                → on, with the localized default message
//   any other text              → on, with that exact text (custom, single language)
const RAW = process.env.NEXT_PUBLIC_MAINTENANCE_BANNER;
const ON = !!RAW && RAW !== "false" && RAW !== "0";
const CUSTOM = ON && RAW !== "true" && RAW !== "1" ? (RAW as string) : null;

/**
 * Non-blocking "we're making improvements" bar. Lives in the content flow (the
 * dashboard's nav and the public navbar are fixed/sticky, so a global fixed bar
 * would overlap them). Rendered twice with different `variant`s; the guard keeps
 * exactly one visible per route.
 *  - variant="global"    → public / auth / signing pages (hidden on /dashboard)
 *  - variant="dashboard" → inside the dashboard <main>
 */
export default function MaintenanceBanner({ variant = "global" }: { variant?: "global" | "dashboard" }) {
  const t = useTranslations("banner");
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const message = CUSTOM ?? t("message");

  useEffect(() => {
    setMounted(true);
    try {
      setDismissed(sessionStorage.getItem("firmiu_maint_banner") === message);
    } catch { /* sessionStorage unavailable */ }
  }, [message]);

  if (!ON || !mounted || dismissed) return null;

  const isDash = pathname.includes("/dashboard");
  if (variant === "global" && isDash) return null;
  if (variant === "dashboard" && !isDash) return null;

  function close() {
    setDismissed(true);
    try { sessionStorage.setItem("firmiu_maint_banner", message); } catch { /* ignore */ }
  }

  return (
    <div className="relative bg-[#FFF7ED] border-b border-[#FED7AA] text-[#9A3412] px-10 py-2 flex items-center justify-center gap-2 text-[13px] leading-snug">
      <svg className="w-4 h-4 shrink-0 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
      <span className="text-center font-medium">{message}</span>
      <button
        type="button"
        onClick={close}
        aria-label={t("dismiss")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A3412]/60 hover:text-[#9A3412] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
