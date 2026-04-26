"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { openCheckout } from "@/lib/paddle";

interface Props {
  email: string;
  userId: string;
  currentPlan: string;
}

export default function PendingPlanChecker({ email, userId, currentPlan }: Props) {
  const t = useTranslations("pending_plan");
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (currentPlan !== "free") return;
    const pendingPlan = localStorage.getItem("firmiu_pending_plan");
    if (!pendingPlan) return;

    localStorage.removeItem("firmiu_pending_plan");
    setShowOverlay(true);

    const timer = setTimeout(async () => {
      await openCheckout(pendingPlan, email, userId);
      setShowOverlay(false);
    }, 800);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!showOverlay) return null;

  return (
    <div
      style={{ zIndex: 9999 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-white"
    >
      <svg
        className="animate-spin mb-4"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="24" cy="24" r="20" stroke="#F97316" strokeWidth="4" strokeLinecap="round" strokeDasharray="90 30" />
      </svg>
      <p className="text-[#1a3c5e] text-base font-medium">{t("loading")}</p>
    </div>
  );
}
