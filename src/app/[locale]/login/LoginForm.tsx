"use client";

import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { loginAction, type AuthState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";
import GoogleButton from "@/components/GoogleButton";

interface LoginFormProps {
  locale: string;
  oauthError?: string | null;
}

const initialState: AuthState = { errorKey: null, success: false };

export default function LoginForm({ locale, oauthError }: LoginFormProps) {
  const t = useTranslations("auth");
  const prefix = locale === "es" ? "" : `/${locale}`;
  const [state, action] = useFormState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  const activeErrorKey = state.errorKey ?? oauthError ?? null;

  return (
    <>
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#111827] leading-tight">
          {t("login.title")}
        </h1>
        <p className="text-[#6B7280] text-sm mt-1">{t("login.subtitle")}</p>
      </div>

      {/* Google */}
      <div className="mb-4">
        <GoogleButton locale={locale} label={t("google_button")} />
      </div>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E7EB]" style={{ borderWidth: "0.5px" }} />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#F8F9FA] md:bg-white px-3 text-xs text-[#6B7280]">
            {t("or_continue_with")}
          </span>
        </div>
      </div>

      {/* Form */}
      <form action={action} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />

        {activeErrorKey && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-[9px] flex items-start gap-2"
          >
            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t(`errors.${activeErrorKey}`)}
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-[#6B7280] mb-1.5">
            {t("login.email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-3 py-2.5 rounded-[9px] border border-[#E5E7EB] text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors"
            placeholder={t("login.placeholder_email")}
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-medium text-[#6B7280]">
              {t("login.password")}
            </label>
            <Link
              href={`${prefix}/recuperar`}
              className="text-xs text-[#F97316] hover:text-[#EA580C] transition-colors"
            >
              {t("login.forgot_link")}
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="w-full px-3 py-2.5 pr-10 rounded-[9px] border border-[#E5E7EB] text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <SubmitButton className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white rounded-[9px] py-2.5 text-sm font-medium transition-colors duration-150">
          {t("login.submit")}
        </SubmitButton>
      </form>

      <p className="text-center text-xs text-[#6B7280] mt-5">
        {t("login.register_link")}{" "}
        <Link href={`${prefix}/register`} className="text-[#F97316] font-medium hover:text-[#EA580C] transition-colors">
          {t("login.register_action")}
        </Link>
      </p>
    </>
  );
}
