"use client";

import { useEffect } from "react";

interface Props {
  currentPlan: string;
}

// Silent cleanup: if the user already has an active plan, remove any lingering
// pending-plan data set by Pricing.tsx before the checkout flow.
export default function PendingPlanChecker({ currentPlan }: Props) {
  useEffect(() => {
    if (currentPlan !== "free") {
      localStorage.removeItem("firmiu_pending_plan");
      document.cookie = "firmiu_pending_plan=; path=/; max-age=0; SameSite=Lax";
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
