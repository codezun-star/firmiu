"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { updateProfileAction, updatePasswordAction } from "@/app/actions/settings";
import { openCheckout } from "@/lib/paddle";
import { toast } from "@/lib/toast";

interface Props {
  locale: string;
  nombre: string;
  email: string;
  isGoogle: boolean;
  userId: string;
  docsThisMonth: number;
  plan: string;
  docsLimit: number;
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

const PLANS = [
  {
    key: "free",
    price: "$0",
    priceId: null as string | null,
    accent: "#6B7280",
    bg: "#F9FAFB",
    border: "#E5E7EB",
    popular: false,
    featureKeys: ["free_f1", "free_f2", "free_f3"],
  },
  {
    key: "starter",
    price: "$15",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER ?? null,
    accent: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    popular: false,
    featureKeys: ["starter_f1", "starter_f2", "starter_f3"],
  },
  {
    key: "pro",
    price: "$29",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO ?? null,
    accent: "#F97316",
    bg: "#1a3c5e",
    border: "#1a3c5e",
    popular: true,
    featureKeys: ["pro_f1", "pro_f2", "pro_f3", "pro_f4"],
  },
  {
    key: "business",
    price: "$59",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_BUSINESS ?? null,
    accent: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    popular: false,
    featureKeys: ["business_f1", "business_f2", "business_f3", "business_f4", "business_f5"],
  },
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
}: Props) {
  const t = useTranslations("settings");
  const router = useRouter();

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

  async function handleUpgrade(priceId: string, planKey: string) {
    console.log("[settings] userId:", userId, "email:", email);
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

  return (
    <div className="p-5 md:p-6 max-w-2xl mx-auto space-y-5">

      {/* ── Profile card ── */}
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
              {profilePending ? (
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {t("save_profile")}
            </button>
          </form>
        </div>
      </div>

      {/* ── Plan & usage card ── */}
      <div className="bg-white rounded-[14px] border-[0.5px] border-[#E5E7EB]">
        <div className="px-5 py-4 border-b border-[#F3F4F6]">
          <p className="text-[14px] font-semibold text-[#111827]">{t("plan_title")}</p>
        </div>
        <div className="px-5 py-5">
          {/* Usage bar */}
          <div className="flex items-start justify-between mb-2">
            <p className="text-[22px] font-bold text-[#111827] leading-none">
              {docsThisMonth}
              <span className="text-[14px] font-normal text-[#9CA3AF] ml-1">
                / {docsLimit >= 999999 ? t("unlimited") : docsLimit} {t("docs_this_month")}
              </span>
            </p>
            <div className="text-right">
              <p className="text-[11px] text-[#9CA3AF]">{t("plan_limits")}</p>
              <p className="text-[13px] font-semibold text-[#374151] capitalize">{plan}</p>
            </div>
          </div>
          <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden mb-6">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: docsLimit >= 999999 ? "20%" : `${pct}%`,
                backgroundColor: docsLimit >= 999999 ? "#10B981" : barColor,
              }}
            />
          </div>

          {/* Plan grid */}
          <p className="text-[13px] font-semibold text-[#111827] mb-3">{t("upgrade")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLANS.map((p) => {
              const isCurrent = plan === p.key;
              const isPro     = p.key === "pro";
              const features  = p.featureKeys.map((k) => t(k as Parameters<typeof t>[0]));

              return (
                <div
                  key={p.key}
                  className={`relative rounded-[12px] border p-4 flex flex-col ${
                    isPro ? "shadow-lg" : ""
                  }`}
                  style={{
                    backgroundColor: p.bg,
                    borderColor:     isCurrent ? p.accent : p.border,
                    borderWidth:     isCurrent ? "2px" : "1px",
                  }}
                >
                  {/* Popular badge */}
                  {isPro && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider text-white px-2.5 py-0.5 rounded-full whitespace-nowrap"
                      style={{ backgroundColor: "#F97316" }}
                    >
                      {t("popular")}
                    </span>
                  )}

                  {/* Plan name + price */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <p
                        className="text-[13px] font-bold"
                        style={{ color: isPro ? "#fff" : p.accent }}
                      >
                        {t(`plan_${p.key}` as Parameters<typeof t>[0])}
                      </p>
                      {isCurrent && (
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: p.accent }}
                        >
                          {t("plan_current")}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[11px] mb-2"
                      style={{ color: isPro ? "#94b8d4" : "#6B7280" }}
                    >
                      {t(`plan_${p.key}_desc` as Parameters<typeof t>[0])}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="text-[24px] font-bold leading-none"
                        style={{ color: isPro ? "#fff" : "#111827" }}
                      >
                        {p.price}
                      </span>
                      <span style={{ color: isPro ? "#6a9abf" : "#9CA3AF" }} className="text-[11px]">
                        {t("per_month")}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-4 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-[11px]">
                        <svg
                          className="w-3 h-3 shrink-0"
                          style={{ color: isPro ? "#F97316" : p.accent }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span style={{ color: isPro ? "#94b8d4" : "#4B5563" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isCurrent ? (
                    <div
                      className="w-full py-2 text-[11px] font-semibold rounded-lg text-center border"
                      style={{ color: p.accent, borderColor: p.accent + "40", backgroundColor: p.accent + "10" }}
                    >
                      {t("plan_current")}
                    </div>
                  ) : p.priceId ? (
                    <button
                      onClick={async () => handleUpgrade(p.priceId!, p.key)}
                      disabled={checkingOut === p.key}
                      className="w-full py-2 text-[11px] font-semibold rounded-lg text-white transition-opacity disabled:opacity-60 flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: isPro ? "#F97316" : p.accent }}
                    >
                      {checkingOut === p.key ? (
                        <>
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>...</span>
                        </>
                      ) : (
                        t("plan_upgrade")
                      )}
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Password card ── */}
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
                {pwPending ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
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

      {/* ── Danger zone ── */}
      <div className="bg-white rounded-[14px] border-[0.5px] border-[#FCA5A5]">
        <div className="px-5 py-4 border-b border-[#FEE2E2]">
          <p className="text-[14px] font-semibold text-[#EF4444]">{t("danger_title")}</p>
        </div>
        <div className="px-5 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-[#374151]">{t("delete_account")}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">{t("delete_desc")}</p>
          </div>
          <button
            disabled
            className="shrink-0 text-[12px] font-semibold text-[#EF4444] border border-[#FCA5A5] hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("delete_account")}
          </button>
        </div>
      </div>
    </div>
  );
}
