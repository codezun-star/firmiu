/**
 * Canonical plan limits — the SINGLE source of truth for every plan gate.
 *
 * Used by:
 *  - api/paddle/webhook/route.ts     → writes suscripciones.limite_documentos (monthly quota)
 *  - actions/documents.ts            → monthly quota + per-send "merge" (batch) cap
 *  - dashboard/nuevo/page.tsx        → how many PDFs the wizard lets you merge in one send
 *  - api/cron/recordatorios/route.ts → which plans get automatic 48h reminders
 *
 * The descriptive numbers shown to the user (plan feature lists in
 * messages/es.json · messages/en.json) must be kept in sync with these — but
 * THIS file is the enforcement point, not the translations.
 */

export type PlanKey = "free" | "starter" | "pro" | "business";

export interface PlanLimits {
  /** Documents allowed per calendar month. */
  monthly: number;
  /** Max PDFs that can be merged into ONE document in a single send. */
  batch: number;
  /** Eligible for automatic 48h signing reminders. */
  reminders: boolean;
}

/** Sentinel for "no monthly cap" (Business). Kept as a big number so existing
 *  `>= 999999` checks in the UI keep working. */
export const UNLIMITED = 999999;

export const PLAN_LIMITS: Record<PlanKey, PlanLimits> = {
  // Reminders are a PAID feature (all paid plans) — they directly help docs get
  // signed. Free has none, which is a reason to upgrade to any paid plan.
  free:     { monthly: 3,         batch: 1,  reminders: false },
  starter:  { monthly: 30,        batch: 5,  reminders: true },
  pro:      { monthly: 60,        batch: 10, reminders: true },
  // Business is NOT shown in the UI for now (see SHOW_BUSINESS in PricingTable and
  // the planKeys list in PricingCards). The limits stay here so the backend keeps
  // working if a Business subscription ever exists / when it's re-enabled.
  business: { monthly: UNLIMITED, batch: 20, reminders: true },
};

/** Resolve a plan string (possibly unknown) to its limits, defaulting to free. */
export function planLimits(plan: string | null | undefined): PlanLimits {
  return PLAN_LIMITS[(plan as PlanKey)] ?? PLAN_LIMITS.free;
}

/** Plans eligible for automatic 48h reminders (derived from PLAN_LIMITS). */
export const REMINDER_PLANS: PlanKey[] = (Object.keys(PLAN_LIMITS) as PlanKey[]).filter(
  (k) => PLAN_LIMITS[k].reminders
);
