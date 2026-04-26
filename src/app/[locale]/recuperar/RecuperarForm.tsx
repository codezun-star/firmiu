"use client";

import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { forgotPasswordAction, type ForgotPasswordState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";

interface RecuperarFormProps {
  locale: string;
}

const initialState: ForgotPasswordState = { sent: false, email: null, errorKey: null };

export default function RecuperarForm({ locale }: RecuperarFormProps) {
  const t = useTranslations("auth");
  const prefix = locale === "es" ? "" : `/${locale}`;
  const [state, action] = useFormState(forgotPasswordAction, initialState);

  // ── Success state ─────────────────────────────────────────
  if (state.sent) {
    return (
      <>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#111827] mb-1">{t("forgot_password.success_title")}</h2>
          <p className="text-sm text-[#6B7280] mb-1">{t("forgot_password.success_detail")}</p>
          <p className="text-sm font-semibold text-[#111827]">{state.email}</p>
        </div>
        <div className="mt-6 text-center">
          <Link
            href={`${prefix}/login`}
            className="text-sm text-[#F97316] hover:text-[#EA580C] font-medium transition-colors"
          >
            {t("forgot_password.back_to_login")}
          </Link>
        </div>
      </>
    );
  }

  // ── Form state ────────────────────────────────────────────
  return (
    <>
      {/* Decorative icon */}
      <div className="flex justify-center mb-5">
        <div className="w-[52px] h-[52px] rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center">
          <svg className="w-6 h-6 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>

      <div className="mb-5 text-center">
        <h1 className="text-[22px] font-semibold text-[#111827] leading-tight">
          {t("forgot_password.title")}
        </h1>
        <p className="text-[#6B7280] text-sm mt-1">{t("forgot_password.subtitle")}</p>
      </div>

      {/* Hint box */}
      <div className="bg-[#F8F9FA] rounded-lg p-3 mb-5">
        <p className="text-xs text-[#6B7280] leading-relaxed">
          {t("forgot_password.hint")}
        </p>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />

        {state.errorKey && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-[9px]">
            {t(`errors.${state.errorKey}`)}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-[#6B7280] mb-1.5">
            {t("forgot_password.email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-3 py-2.5 rounded-[9px] border border-[#E5E7EB] text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors"
            placeholder="juan@empresa.com"
          />
        </div>

        <SubmitButton className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white rounded-[9px] py-2.5 text-sm font-medium transition-colors duration-150">
          {t("forgot_password.submit")}
        </SubmitButton>
      </form>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E7EB]" style={{ borderWidth: "0.5px" }} />
        </div>
      </div>

      <div className="text-center">
        <Link
          href={`${prefix}/login`}
          className="text-sm text-[#F97316] hover:text-[#EA580C] font-medium transition-colors"
        >
          {t("forgot_password.back_to_login")}
        </Link>
      </div>
    </>
  );
}
