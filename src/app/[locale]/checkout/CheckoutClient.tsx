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

  useEffect(() => {
    let redirected = false;

    const handleDone = () => {
      if (!redirected) {
        redirected = true;
        router.push(`${prefix}/dashboard`);
      }
    };

    window.addEventListener("firmiu:paddle-success", handleDone);
    window.addEventListener("firmiu:paddle-closed", handleDone);

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
      window.removeEventListener("firmiu:paddle-success", handleDone);
      window.removeEventListener("firmiu:paddle-closed", handleDone);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
