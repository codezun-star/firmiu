"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const STORAGE_KEY = "firmiu_consent";

const GRANT = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
} as const;

const DENY = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GDPR / ePrivacy cookie consent banner wired to Google Consent Mode v2.
 *
 * Consent defaults to "denied" (set in the document <head> before gtag.js
 * loads). This banner lets the visitor grant or keep denied, persists the
 * choice, and calls `gtag('consent','update', …)` so Analytics adjusts.
 */
export default function ConsentBanner() {
  const t = useTranslations("consent");
  const locale = useLocale();
  const prefix = locale === "en" ? "/en" : "";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "granted") {
        window.gtag?.("consent", "update", GRANT);
      } else if (stored !== "denied") {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (private mode, etc.) — show the banner.
      setVisible(true);
    }
  }, []);

  function choose(granted: boolean) {
    try {
      localStorage.setItem(STORAGE_KEY, granted ? "granted" : "denied");
    } catch {
      // ignore persistence errors
    }
    window.gtag?.("consent", "update", granted ? GRANT : DENY);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("aria_label")}
      className="fixed bottom-0 inset-x-0 z-[60] p-3 sm:p-4 animate-[firmiu-text-in_0.3s_ease-out]"
    >
      <div className="max-w-3xl mx-auto bg-white border border-[#E5E7EB] shadow-xl rounded-[14px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-[13px] text-[#4B5563] leading-relaxed flex-1">
          {t("text")}{" "}
          <Link href={`${prefix}/privacidad`} className="text-[#1a3c5e] font-medium underline hover:text-[#F97316] transition-colors">
            {t("privacy")}
          </Link>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => choose(false)}
            className="px-4 py-2 text-[13px] font-medium text-[#6B7280] hover:text-[#111827] rounded-[9px] border border-[#E5E7EB] hover:bg-gray-50 transition-colors"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className="px-4 py-2 text-[13px] font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] rounded-[9px] transition-colors"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
