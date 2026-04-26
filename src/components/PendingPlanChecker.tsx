"use client";

import { useEffect } from "react";
import { openCheckout } from "@/lib/paddle";

interface Props {
  email: string;
  userId: string;
  currentPlan: string;
}

export default function PendingPlanChecker({ email, userId, currentPlan }: Props) {
  useEffect(() => {
    if (currentPlan !== "free") return;
    const pendingPlan = localStorage.getItem("firmiu_pending_plan");
    if (!pendingPlan) return;
    localStorage.removeItem("firmiu_pending_plan");
    openCheckout(pendingPlan, email, userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
