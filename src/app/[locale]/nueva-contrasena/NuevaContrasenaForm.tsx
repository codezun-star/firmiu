"use client";

import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { resetPasswordAction, type ResetPasswordState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";

interface NuevaContrasenaFormProps {
  locale: string;
}

const initialState: ResetPasswordState = { success: false, errorKey: null };

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

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

export default function NuevaContrasenaForm({ locale }: NuevaContrasenaFormProps) {
  const t = useTranslations("auth");
  const prefix = locale === "es" ? "" : `/${locale}`;
  const [state, action] = useFormState(resetPasswordAction, initialState);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getPasswordStrength(password);
  const mismatch = confirm.length > 0 && password !== confirm;

  const strengthLabels = [
    "",
    t("register.strength_weak"),
    t("register.strength_fair"),
    t("register.strength_good"),
    t("register.strength_strong"),
  ];
  const strengthTextColors = ["", "text-red-500", "text-orange-400", "text-yellow-500", "text-green-600"];

  return (
    <>
      {/* Decorative icon */}
      <div className="flex justify-center mb-5">
        <div className="w-[52px] h-[52px] rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center">
          <svg className="w-6 h-6 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
      </div>

      <div className="mb-5 text-center">
        <h1 className="text-[22px] font-semibold text-[#111827] leading-tight">
          {t("new_password.title")}
        </h1>
        <p className="text-[#6B7280] text-sm mt-1">{t("new_password.subtitle")}</p>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />

        {state.errorKey && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-[9px]">
            {t(`errors.${state.errorKey}`)}
          </div>
        )}

        {/* New password */}
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-[#6B7280] mb-1.5">
            {t("new_password.password")}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 pr-10 rounded-[9px] border border-[#E5E7EB] text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-colors"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]" tabIndex={-1}>
              <EyeIcon visible={showPassword} />
            </button>
          </div>
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div key={level} className={`h-1 flex-1 rounded-full transition-colors duration-200 ${strength >= level ? strengthColors[strength] : "bg-[#E5E7EB]"}`} />
                ))}
              </div>
              <p className={`text-[10px] mt-1 font-medium ${strengthTextColors[strength]}`}>{strengthLabels[strength]}</p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirm" className="block text-xs font-medium text-[#6B7280] mb-1.5">
            {t("new_password.confirm_password")}
          </label>
          <div className="relative">
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full px-3 py-2.5 pr-10 rounded-[9px] border text-sm bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none transition-colors ${
                mismatch
                  ? "border-red-400 ring-2 ring-red-400/10 focus:border-red-400 focus:ring-red-400/10"
                  : "border-[#E5E7EB] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10"
              }`}
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]" tabIndex={-1}>
              <EyeIcon visible={showConfirm} />
            </button>
          </div>
          {mismatch && (
            <p className="text-xs text-red-500 mt-1">{t("new_password.passwords_not_match")}</p>
          )}
        </div>

        <SubmitButton
          className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white rounded-[9px] py-2.5 text-sm font-medium transition-colors duration-150"
        >
          {t("new_password.submit")}
        </SubmitButton>
      </form>

      <div className="text-center mt-5">
        <Link href={`${prefix}/login`} className="text-sm text-[#F97316] hover:text-[#EA580C] font-medium transition-colors">
          {t("new_password.back_to_login")}
        </Link>
      </div>
    </>
  );
}
