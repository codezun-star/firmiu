"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { updateProfileAction, updatePasswordAction, deleteAccountAction, cancelSubscriptionAction } from "@/app/actions/settings";
import { createClient } from "@/lib/supabase/client";
import { openCheckout } from "@/lib/paddle";
import { toast } from "@/lib/toast";
import { PLAN_LIMITS } from "@/lib/plans";

interface Props {
  locale: string;
  nombre: string;
  email: string;
  isGoogle: boolean;
  userId: string;
  docsThisMonth: number;
  plan: string;
  docsLimit: number;
  estado: string;
  periodoInicio: string | null;
  periodoFin: string | null;
}

function initials(name: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Plan ranking + the paid plans the user can upgrade TO (Business is "Próximamente",
// so it's not an in-dashboard upgrade option — the full grid lives on /precios).
const PLAN_RANK: Record<string, number> = { free: 0, starter: 1, pro: 2, business: 3 };
const PAID_PLANS = [
  { key: "starter", price: "$15", priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER ?? null },
  { key: "pro", price: "$29", priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO ?? null },
] as const;

export default function SettingsClient({
  locale,
  nombre,
  email,
  isGoogle,
  userId,
  docsThisMonth,
  plan,
  docsLimit,
  estado,
  periodoInicio,
  periodoFin,
}: Props) {
  const t = useTranslations("settings");
  const router = useRouter();
  const prefix = locale === "es" ? "" : `/${locale}`;

  // Listen for Paddle checkout completion (fired from paddle.ts eventCallback)
  useEffect(() => {
    function handlePaddleSuccess() {
      toast.success(t("billing_success"));
      router.refresh();
    }
    window.addEventListener("firmiu:paddle-success", handlePaddleSuccess);
    return () => window.removeEventListener("firmiu:paddle-success", handlePaddleSuccess);
  }, [router, t]);

  // Profile form
  const [profileName, setProfileName] = useState(nombre);
  const [profilePending, startProfile] = useTransition();

  // Password form
  const [pwPending, startPw] = useTransition();
  const [pwValue, setPwValue] = useState("");
  const [cfValue, setCfValue] = useState("");

  // Checkout state
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  // Cancel subscription state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.append("locale", locale);
    startProfile(async () => {
      const result = await updateProfileAction(fd);
      if (!result.error) {
        toast.success(t("profile_saved"));
        router.refresh();
      } else {
        toast.error(t(`errors.${result.error}` as Parameters<typeof t>[0]));
      }
    });
  }

  function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startPw(async () => {
      const result = await updatePasswordAction(fd);
      if (!result.error) {
        toast.success(t("password_saved"));
        setPwValue("");
        setCfValue("");
      } else {
        toast.error(t(`errors.${result.error}` as Parameters<typeof t>[0]));
      }
    });
  }

  async function handleCancelSubscription() {
    setIsCanceling(true);
    try {
      const result = await cancelSubscriptionAction();
      if (result.success) {
        toast.success(t("cancel_sub_success"));
        setShowCancelConfirm(false);
        router.refresh();
      } else {
        toast.error(t("cancel_sub_error"));
      }
    } catch {
      toast.error(t("cancel_sub_error"));
    } finally {
      setIsCanceling(false);
    }
  }

  async function handleDeleteAccount() {
    setIsDeleting(true);
    toast.info(t("deleting"));
    try {
      const result = await deleteAccountAction();
      if (result.success) {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
      } else {
        toast.error(t("delete_error"));
        setIsDeleting(false);
      }
    } catch {
      toast.error(t("delete_error"));
      setIsDeleting(false);
    }
  }

  async function handleUpgrade(priceId: string, planKey: string) {
    setCheckingOut(planKey);
    try {
      await openCheckout(priceId, email, userId);
    } catch {
      toast.error(t("errors.generic"));
    } finally {
      setCheckingOut(null);
    }
  }

  const pct = docsLimit > 0 ? Math.min((docsThisMonth / docsLimit) * 100, 100) : 100;
  const barColor = pct >= 100 ? "#EF4444" : pct >= 66 ? "#F97316" : "#10B981";
  const isUnlimited = docsLimit >= 999999;

  // Upgrade options = paid plans ranked above the current one (excludes Business).
  const upgradeOptions = PAID_PLANS
    .filter((p) => PLAN_RANK[p.key] > (PLAN_RANK[plan] ?? 0) && p.priceId)
    .map((p) => ({
      ...p,
      docs: PLAN_LIMITS[p.key].monthly,
      pdfs: PLAN_LIMITS[p.key].batch,
    }));

  // ── Billing cycle (renewal / end date) ──
  const intlLocale = locale === "en" ? "en" : "es";
  const finDate = periodoFin ? new Date(periodoFin) : null;
  const inicioDate = periodoInicio
    ? new Date(periodoInicio)
    : (finDate ? new Date(finDate.getTime() - 30 * 86400000) : null); // estimate a 30-day cycle if start missing
  const nowDate = new Date();
  const daysLeft = finDate ? Math.max(0, Math.ceil((finDate.getTime() - nowDate.getTime()) / 86400000)) : 0;
  const cyclePct = finDate && inicioDate && finDate.getTime() > inicioDate.getTime()
    ? Math.min(100, Math.max(0, ((nowDate.getTime() - inicioDate.getTime()) / (finDate.getTime() - inicioDate.getTime())) * 100))
    : 0;
  const fmtDate = (d: Date) => d.toLocaleDateString(intlLocale, { day: "numeric", month: "long", year: "numeric" });
  const fmtShort = (d: Date) => d.toLocaleDateString(intlLocale, { day: "numeric", month: "short" });

  const spinner = (
    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  return (
    <div className="p-5 md:p-6 max-w-5xl space-y-6">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-[17px] font-semibold text-[#111827] leading-tight">{t("page_title")}</h1>
        <p className="text-xs text-[#9CA3AF] mt-0.5">{t("page_subtitle")}</p>
      </div>

      {/* ── Profile + Password (two columns on desktop) ── */}
      <div className="grid lg:grid-cols-2 gap-5 items-start">

        {/* Profile card */}
        <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB]">
          <div className="px-5 py-4 border-b border-[#F3F4F6]">
            <p className="text-[14px] font-semibold text-[#111827]">{t("profile_title")}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">{t("profile_desc")}</p>
          </div>
          <div className="px-5 py-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-[#1a3c5e] flex items-center justify-center shrink-0">
                <span className="text-white text-[18px] font-bold">{initials(profileName || nombre)}</span>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#111827]">{profileName || nombre || "Usuario"}</p>
                <p className="text-[12px] text-[#9CA3AF]">{email}</p>
                {isGoogle && (
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-[#F0F7FF] text-[#2563EB] border border-[#BFDBFE] px-2 py-0.5 rounded-full font-medium">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-[#374151] mb-1.5">{t("name")}</label>
                <input
                  name="nombre"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2.5 text-[13px] bg-white border-[0.5px] border-[#E5E7EB] rounded-[9px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#374151] mb-1.5">
                  {t("email")}
                  <span className="text-[#9CA3AF] font-normal ml-1.5">— {t("email_hint")}</span>
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-3 py-2.5 text-[13px] bg-[#F9FAFB] border-[0.5px] border-[#E5E7EB] rounded-[9px] text-[#9CA3AF] cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={profilePending}
                className="inline-flex items-center gap-2 bg-[#1a3c5e] hover:bg-[#15304d] disabled:opacity-60 text-white text-[13px] font-medium px-4 py-2 rounded-[9px] transition-colors"
              >
                {profilePending ? spinner : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {t("save_profile")}
              </button>
            </form>
          </div>
        </div>

        {/* Password card */}
        <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB]">
          <div className="px-5 py-4 border-b border-[#F3F4F6]">
            <p className="text-[14px] font-semibold text-[#111827]">{t("password_title")}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">{t("password_desc")}</p>
          </div>
          <div className="px-5 py-5">
            {isGoogle ? (
              <div className="flex items-start gap-3 p-4 bg-[#F0F7FF] border border-[#BFDBFE] rounded-[9px]">
                <svg className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[12px] text-[#1e40af]">{t("password_google")}</p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#374151] mb-1.5">{t("new_password")}</label>
                  <input
                    name="password"
                    type="password"
                    value={pwValue}
                    onChange={(e) => setPwValue(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 text-[13px] bg-white border-[0.5px] border-[#E5E7EB] rounded-[9px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#374151] mb-1.5">{t("confirm_password")}</label>
                  <input
                    name="confirm"
                    type="password"
                    value={cfValue}
                    onChange={(e) => setCfValue(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 text-[13px] bg-white border-[0.5px] border-[#E5E7EB] rounded-[9px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={pwPending || !pwValue}
                  className="inline-flex items-center gap-2 bg-[#1a3c5e] hover:bg-[#15304d] disabled:opacity-60 text-white text-[13px] font-medium px-4 py-2 rounded-[9px] transition-colors"
                >
                  {pwPending ? spinner : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  {t("save_password")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Plan & usage (full width) ── */}
      <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB]">
        <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
          <p className="text-[14px] font-semibold text-[#111827]">{t("plan_title")}</p>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a3c5e] bg-[#1a3c5e]/[0.07] px-2.5 py-1 rounded-full capitalize">
            {plan === "free" ? t("plan_free") : plan}
          </span>
        </div>
        <div className="px-5 py-5">

          {/* Usage + billing cycle (two columns on desktop) */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* Usage */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <p className="text-[22px] font-bold text-[#111827] leading-none">
                  {docsThisMonth}
                  <span className="text-[14px] font-normal text-[#9CA3AF] ml-1">
                    / {isUnlimited ? t("unlimited") : docsLimit} {t("docs_this_month")}
                  </span>
                </p>
              </div>
              <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: isUnlimited ? "20%" : `${pct}%`,
                    backgroundColor: isUnlimited ? "#10B981" : barColor,
                  }}
                />
              </div>
            </div>

            {/* Billing cycle — when the plan renews / ends */}
            {plan !== "free" && finDate ? (
              <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] p-3.5">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#1a3c5e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#9CA3AF] leading-tight">
                      {estado === "canceling" ? t("billing_ends_label") : t("billing_renews_label")}
                    </p>
                    <p className="text-[13px] font-semibold text-[#111827]">{fmtDate(finDate)}</p>
                  </div>
                  <span className="ml-auto text-[11px] font-medium text-[#6B7280] shrink-0">
                    {t("billing_days_left", { n: daysLeft })}
                  </span>
                </div>
                {inicioDate && (
                  <>
                    <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${cyclePct}%`, backgroundColor: estado === "canceling" ? "#F97316" : "#1a3c5e" }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-1.5">
                      <span>{fmtShort(inicioDate)}</span>
                      <span>{fmtShort(finDate)}</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="rounded-[10px] border border-dashed border-[#E5E7EB] bg-[#F9FAFB] p-3.5 flex items-center text-[12px] text-[#9CA3AF]">
                {t("plan_free_desc")}
              </div>
            )}
          </div>

          {/* Cancel subscription — only for paid plans */}
          {plan !== "free" && (
            <div className="mt-5">
              {estado === "canceling" ? (
                <div className="flex items-start gap-2.5 p-3 rounded-[10px] bg-[#FFF7ED] border border-[#FED7AA]">
                  <span className="inline-flex items-center shrink-0 mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F97316] bg-[#FED7AA] px-2 py-0.5 rounded-full whitespace-nowrap">
                    {t("cancel_sub_pending")}
                  </span>
                  <p className="text-[12px] text-[#92400E]">{t("cancel_sub_pending_desc")}</p>
                </div>
              ) : estado === "active" ? (
                !showCancelConfirm ? (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[12px] text-[#9CA3AF]">{t("cancel_sub_question")}</p>
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="shrink-0 text-[12px] font-medium text-[#EF4444] hover:text-[#DC2626] underline underline-offset-2 transition-colors"
                    >
                      {t("cancel_sub")}
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-[10px] bg-[#FFF5F5] border border-[#FCA5A5] space-y-3">
                    <p className="text-[12px] text-[#374151]">{t("cancel_sub_confirm")}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCancelConfirm(false)}
                        disabled={isCanceling}
                        className="flex-1 py-1.5 text-[12px] font-medium text-[#6B7280] hover:text-[#111827] border-[0.5px] border-[#E5E7EB] hover:border-[#D1D5DB] rounded-lg transition-colors disabled:opacity-60"
                      >
                        {t("cancel_sub_no")}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelSubscription}
                        disabled={isCanceling}
                        className="flex-1 py-1.5 text-[12px] font-semibold text-white bg-[#EF4444] hover:bg-[#DC2626] rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
                      >
                        {isCanceling && spinner}
                        {t("cancel_sub_yes")}
                      </button>
                    </div>
                  </div>
                )
              ) : null}
            </div>
          )}

          {/* Upgrade options (compact) — full comparison lives on /precios */}
          <div className="mt-6 border-t border-[#F3F4F6] pt-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-[#111827]">{t("upgrade_title")}</p>
              <Link
                href={`${prefix}/precios`}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#1a3c5e] hover:text-[#F97316] transition-colors"
              >
                {t("compare_plans")}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {upgradeOptions.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {upgradeOptions.map((opt) => (
                  <div
                    key={opt.key}
                    className="rounded-[12px] border border-[#E5E7EB] hover:border-[#1a3c5e]/40 transition-colors p-4 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <p className="text-[13px] font-bold text-[#111827]">{t(`plan_${opt.key}` as Parameters<typeof t>[0])}</p>
                        <span className="text-[13px] font-bold text-[#111827]">{opt.price}</span>
                        <span className="text-[11px] text-[#9CA3AF]">{t("per_month")}</span>
                      </div>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">
                        {t("upgrade_highlight", { docs: opt.docs, pdfs: opt.pdfs })}
                      </p>
                    </div>
                    <button
                      onClick={() => opt.priceId && handleUpgrade(opt.priceId, opt.key)}
                      disabled={checkingOut === opt.key}
                      className="shrink-0 text-[12px] font-semibold text-white bg-[#1a3c5e] hover:bg-[#15304d] px-3.5 py-2 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
                    >
                      {checkingOut === opt.key ? spinner : t("plan_upgrade")}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-[#9CA3AF]">
                {t("top_plan")}{" "}
                <a href="mailto:codezun@gmail.com" className="font-medium text-[#1a3c5e] hover:text-[#F97316] transition-colors">
                  codezun@gmail.com
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Danger zone (full width) ── */}
      <div className="bg-white rounded-[14px] border-[0.5px] border-[#FCA5A5]">
        <div className="px-5 py-4 border-b border-[#FEE2E2]">
          <p className="text-[14px] font-semibold text-[#EF4444]">{t("danger_title")}</p>
        </div>
        <div className="px-5 py-5">
          {!showDeleteConfirm ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-[#374151]">{t("delete_account")}</p>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">{t("delete_desc")}</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="shrink-0 text-[12px] font-semibold text-[#EF4444] border border-[#FCA5A5] hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                {t("delete_account")}
              </button>
            </div>
          ) : (
            <div className="rounded-[12px] border border-[#FCA5A5] bg-[#FFF5F5] p-4 space-y-4">
              <p className="text-[14px] font-bold text-[#EF4444]">{t("delete_confirm_title")}</p>
              <div>
                <p className="text-[12px] font-semibold text-[#374151] mb-2">{t("delete_what_happens")}</p>
                <ul className="space-y-1.5">
                  {(["delete_consequence_1", "delete_consequence_2", "delete_consequence_3", "delete_consequence_4"] as const).map((key) => (
                    <li key={key} className="flex items-start gap-2 text-[12px] text-[#4B5563]">
                      <svg className="w-3.5 h-3.5 text-[#EF4444] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {t(key as Parameters<typeof t>[0])}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#374151] mb-1.5">{t("delete_type_confirm")}</label>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] bg-white border border-[#FCA5A5] rounded-[9px] text-[#374151] placeholder-[#F87171]/60 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#EF4444]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                  className="flex-1 py-2 text-[13px] font-medium text-[#6B7280] hover:text-[#111827] border-[0.5px] border-[#E5E7EB] hover:border-[#D1D5DB] rounded-[9px] transition-colors"
                >
                  {t("delete_cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== t("delete_confirm_word") || isDeleting}
                  className="flex-1 py-2 text-[13px] font-semibold text-white bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-40 disabled:cursor-not-allowed rounded-[9px] transition-colors flex items-center justify-center gap-1.5"
                >
                  {isDeleting && spinner}
                  {t("delete_account")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
