"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface PricingProps {
  locale: string;
}

const planKeys = ["free", "starter", "pro", "business"] as const;

const PRICE_IDS: Record<string, string | null> = {
  free:     null,
  starter:  process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER ?? null,
  pro:      process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO ?? null,
  business: process.env.NEXT_PUBLIC_PADDLE_PRICE_BUSINESS ?? null,
};

export default function Pricing({ locale }: PricingProps) {
  const t = useTranslations("home.pricing");
  const router = useRouter();
  const prefix = locale === "es" ? "" : `/${locale}`;

  function handlePlanClick(key: string) {
    const priceId = PRICE_IDS[key];
    if (priceId) {
      localStorage.setItem("firmiu_pending_plan", priceId);
    }
    router.push(`${prefix}/register`);
  }

  return (
    <section id="pricing" className="py-20 bg-[#F8F9FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-3">
            {t("title")}
          </h2>
          <p className="text-[#6B7280] text-base">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {planKeys.map((key) => {
            const isPro = key === "pro";
            const features = t.raw(`${key}.features`) as string[];

            return (
              <div
                key={key}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  isPro
                    ? "bg-[#1a3c5e] border border-[#1a3c5e] shadow-xl"
                    : "bg-white border-[0.5px] border-[#E5E7EB] hover:shadow-md transition-shadow"
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[#F97316] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {t("popular")}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <p className={`text-xs font-semibold mb-2 uppercase tracking-wider ${isPro ? "text-[#94b8d4]" : "text-[#6B7280]"}`}>
                    {t(`${key}.name`)}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${isPro ? "text-white" : "text-[#111827]"}`}>
                      ${t(`${key}.price`)}
                    </span>
                    <span className={`text-sm ${isPro ? "text-[#6a9abf]" : "text-[#9CA3AF]"}`}>
                      {t("monthly")}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <svg
                        className={`w-4 h-4 mt-0.5 shrink-0 ${isPro ? "text-[#F97316]" : "text-[#10B981]"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={isPro ? "text-[#94b8d4]" : "text-[#6B7280]"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanClick(key)}
                  className={`block w-full text-center py-2.5 px-4 rounded-[10px] text-sm font-semibold transition-colors ${
                    isPro
                      ? "bg-[#F97316] hover:bg-[#EA580C] text-white"
                      : "bg-[#F8F9FA] hover:bg-[#F3F4F6] text-[#111827] border-[0.5px] border-[#E5E7EB]"
                  }`}
                >
                  {key === "free" ? t("cta_free") : t("cta_paid")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
