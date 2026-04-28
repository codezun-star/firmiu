"use client";

import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { registerAction, type AuthState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";
import GoogleButton from "@/components/GoogleButton";

interface RegisterFormProps {
  locale: string;
  plan?: string;
}

const initialState: AuthState = { errorKey: null, success: false };

function getPasswordStrength(password: string): number {
  if (password.length === 0) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const strengthColors = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"];

export default function RegisterForm({ locale, plan }: RegisterFormProps) {
  const t = useTranslations("auth");
  const prefix = locale === "es" ? "" : `/${locale}`;
  const [state, action] = useFormState(registerAction, initialState);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const strength = getPasswordStrength(password);

  const strengthLabels = [
    "",
    t("register.strength_weak"),
    t("register.strength_fair"),
    t("register.strength_good"),
    t("register.strength_strong"),
  ];
  const strengthTextColors = ["", "text-red-500", "text-orange-400", "text-yellow-500", "text-green-600"];

  // ── Success state ─────────────────────────────────────────
  if (state.success) {
    return (
      <>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#111827] mb-1">{t("register.success_title")}</h2>
          <p className="text-sm text-[#6B7280] mb-1">{t("register.success_detail")}</p>
          <p className="text-sm font-semibold text-[#111827] mb-3">{state.email}</p>
          <p className="text-xs text-[#6B7280] leading-relaxed">{t("register.success_note")}</p>
        </div>
        <p className="text-center text-xs text-[#6B7280] mt-5">
          {t("register.login_link")}{" "}
          <Link href={`${prefix}/login`} className="text-[#F97316] font-medium hover:text-[#EA580C] transition-colors">
            {t("register.login_action")}
          </Link>
        </p>
      </>
    );
  }

  // ── Form state ────────────────────────────────────────────
  return (
    <>
      <div className="mb-5">
        <h1 className="text-[22px] font-semibold text-[#111827] leading-tight">
          {t("register.title")}
        </h1>
        <p className="text-[#6B7280] text-sm mt-1">{t("register.subtitle")}</p>
      </div>

      {/* Google */}
      <div className="mb-1">
        <GoogleButton locale={locale} label={t("google_button")} />
      </div>
      <p className="text-xs text-center text-[#6a9abf] mb-4 leading-relaxed">
        {t("google_terms")}{" "}
        <Link href={`${prefix}/terminos`} target="_blank" className="underline text-[#94b8d4] hover:text-[#1a3c5e] transition-colors">
          {t("google_terms_service")}
        </Link>{" "}
        {t("google_terms_and")}{" "}
        <Link href={`${prefix}/privacidad`} target="_blank" className="underline text-[#94b8d4] hover:text-[#1a3c5e] transition-colors">
          {t("google_terms_privacy")}
        </Link>
      </p>

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

      <form action={action} className="space-y-3.5">
        <input type="hidden" name="locale" value={locale} />
        {plan && <input type="hidden" name="plan" value={plan} />}

        {state.errorKey && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-[9px] flex items-start gap-2">
            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t(`errors.${state.errorKey}`)}
          </div>
        )}

        {/* Name grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="nombre" className="block text-xs font-medium text-[#6B7280] mb-1.5">
              {t("register.first_name")}
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              autoComplete="given-name"
              required
              className="w-full px-3 py-2.5 rounded-[9px] border border-[#E5E7EB] text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors"
              placeholder={t("register.placeholder_name")}
            />
          </div>
          <div>
            <label htmlFor="apellido" className="block text-xs font-medium text-[#6B7280] mb-1.5">
              {t("register.last_name")}
            </label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              autoComplete="family-name"
              className="w-full px-3 py-2.5 rounded-[9px] border border-[#E5E7EB] text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors"
              placeholder={t("register.placeholder_lastname")}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-[#6B7280] mb-1.5">
            {t("register.email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-3 py-2.5 rounded-[9px] border border-[#E5E7EB] text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors"
            placeholder={t("register.placeholder_email")}
          />
        </div>

        {/* Password + strength */}
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-[#6B7280] mb-1.5">
            {t("register.password")}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* Strength meter */}
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                      strength >= level ? strengthColors[strength] : "bg-[#E5E7EB]"
                    }`}
                  />
                ))}
              </div>
              <p className={`text-[10px] mt-1 font-medium ${strengthTextColors[strength]}`}>
                {strengthLabels[strength]}
              </p>
            </div>
          )}
        </div>

        <SubmitButton className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white rounded-[9px] py-2.5 text-sm font-medium transition-colors duration-150 mt-1">
          {t("register.submit")}
        </SubmitButton>
      </form>

      <p className="text-center text-xs text-[#6B7280] mt-5">
        {t("register.login_link")}{" "}
        <Link href={`${prefix}/login`} className="text-[#F97316] font-medium hover:text-[#EA580C] transition-colors">
          {t("register.login_action")}
        </Link>
      </p>
    </>
  );
}
