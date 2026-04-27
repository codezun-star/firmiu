"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Logo from "@/components/Logo";
import { openCheckout } from "@/lib/paddle";

interface Props {
  locale: string;
  priceId: string;
  userEmail: string;
  userId: string;
}

export default function CheckoutClient({ locale, priceId, userEmail, userId }: Props) {
  const t = useTranslations("checkout");
  const router = useRouter();
  const prefix = locale === "es" ? "" : `/${locale}`;

  const [showFallback, setShowFallback] = useState(false);
  const [showCancelScreen, setShowCancelScreen] = useState(false);

  useEffect(() => {
    let done = false;

    const handleSuccess = () => {
      if (!done) {
        done = true;
        router.push(`${prefix}/dashboard`);
      }
    };

    const handleClosed = () => {
      if (!done) {
        done = true;
        setShowCancelScreen(true);
      }
    };

    window.addEventListener("firmiu:paddle-success", handleSuccess);
    window.addEventListener("firmiu:paddle-closed", handleClosed);

    let paddleOpened = false;

    const openTimer = setTimeout(async () => {
      try {
        await openCheckout(priceId, userEmail, userId);
        paddleOpened = true;
      } catch {
        setShowFallback(true);
      }
    }, 1500);

    // Fallback: if Paddle never opens after 8s, show manual link
    const fallbackTimer = setTimeout(() => {
      if (!paddleOpened) setShowFallback(true);
    }, 8000);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(fallbackTimer);
      window.removeEventListener("firmiu:paddle-success", handleSuccess);
      window.removeEventListener("firmiu:paddle-closed", handleClosed);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showCancelScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="w-full max-w-sm flex flex-col items-center text-center gap-5">
          <Logo locale={locale} />

          {/* Info icon */}
          <div className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#1a3c5e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-[22px] font-bold text-[#111827]">{t("account_ready")}</h1>
            <p className="text-[14px] text-[#6B7280]">{t("free_plan_msg")}</p>
            <p className="text-[13px] text-[#9CA3AF]">{t("upgrade_anytime")}</p>
          </div>

          <div className="flex flex-col gap-3 w-full pt-1">
            <Link
              href={`${prefix}/dashboard/cuenta`}
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3 px-4 rounded-[9px] transition-colors text-sm text-center"
            >
              {t("see_plans")}
            </Link>
            <Link
              href={`${prefix}/dashboard`}
              className="w-full border border-[#E5E7EB] hover:border-[#D1D5DB] text-[#374151] font-medium py-3 px-4 rounded-[9px] transition-colors text-sm text-center"
            >
              {t("go_dashboard")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6 p-6">
      <Logo locale={locale} />

      {/* Spinner */}
      <svg
        className="animate-spin"
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="22" cy="22" r="18"
          stroke="#F97316"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80 30"
        />
      </svg>

      <p className="text-[#6B7280] text-sm text-center max-w-xs">
        {t("loading")}
      </p>

      {showFallback && (
        <div className="flex flex-col items-center gap-3 mt-2 text-center">
          <p className="text-xs text-[#9CA3AF] max-w-xs">{t("error")}</p>
          <Link
            href={`${prefix}/dashboard`}
            className="text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors underline underline-offset-2"
          >
            {t("go_dashboard")}
          </Link>
        </div>
      )}
    </div>
  );
}
