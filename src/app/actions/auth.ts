"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidEmail, isValidPassword, sanitizeText } from "@/lib/security";

export type AuthState = {
  errorKey: string | null;
  success: boolean;
  email?: string;
};

export type ForgotPasswordState = {
  sent: boolean;
  email: string | null;
  errorKey: string | null;
};

export type ResetPasswordState = {
  success: boolean;
  errorKey: string | null;
};

function mapErrorKey(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes("invalid login credentials")) return "invalid_credentials";
  if (msg.includes("email not confirmed")) return "email_not_confirmed";
  if (
    msg.includes("already registered") ||
    msg.includes("already in use") ||
    msg.includes("already exists") ||
    msg.includes("user already")
  )
    return "email_in_use";
  if (msg.includes("password should be") || msg.includes("password must be"))
    return "weak_password";
  if (
    msg.includes("rate limit") ||
    msg.includes("security purposes") ||
    msg.includes("too many")
  )
    return "rate_limit";
  return "generic";
}

function getPrefix(locale: string): string {
  return locale === "es" ? "" : `/${locale}`;
}

// ─── Register ────────────────────────────────────────────────
export async function registerAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const nombre = sanitizeText((formData.get("nombre") as string) ?? "", 100);
  const apellido = sanitizeText((formData.get("apellido") as string) ?? "", 100);
  const fullName = apellido ? `${nombre} ${apellido}` : nombre;
  const email = ((formData.get("email") as string) ?? "").trim().toLowerCase().slice(0, 320);
  const password = (formData.get("password") as string) ?? "";
  const locale = (formData.get("locale") as string) ?? "es";
  const plan = (formData.get("plan") as string) ?? "";
  const terms = formData.get("terms") === "on";

  if (!nombre || !email || !password) {
    return { errorKey: "generic", success: false };
  }
  if (!isValidEmail(email)) {
    return { errorKey: "generic", success: false };
  }
  if (!isValidPassword(password)) {
    return { errorKey: "weak_password", success: false };
  }
  if (!terms) {
    return { errorKey: "terms_required", success: false };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre: fullName },
    },
  });

  if (error) {
    return { errorKey: mapErrorKey(error.message), success: false };
  }

  if (data.session) {
    if (plan) {
      redirect(`${getPrefix(locale)}/checkout?plan=${encodeURIComponent(plan)}`);
    }
    redirect(`${getPrefix(locale)}/dashboard`);
  }

  return { success: true, email, errorKey: null };
}

// ─── Login ───────────────────────────────────────────────────
export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = ((formData.get("email") as string) ?? "").trim().toLowerCase().slice(0, 320);
  const password = ((formData.get("password") as string) ?? "").slice(0, 128);
  const locale = (formData.get("locale") as string) ?? "es";

  if (!email || !password) {
    return { errorKey: "generic", success: false };
  }
  if (!isValidEmail(email)) {
    return { errorKey: "generic", success: false };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { errorKey: mapErrorKey(error.message), success: false };
  }

  redirect(`${getPrefix(locale)}/dashboard`);
}

// ─── Google OAuth ─────────────────────────────────────────────
export async function googleLoginAction(formData: FormData): Promise<void> {
  const locale = (formData.get("locale") as string) ?? "es";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect(`${getPrefix(locale)}/login?error=oauth_error`);
  }

  redirect(data.url);
}

// ─── Forgot password ─────────────────────────────────────────
export async function forgotPasswordAction(
  prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = ((formData.get("email") as string) ?? "").trim().toLowerCase().slice(0, 320);
  const locale = (formData.get("locale") as string) ?? "es";

  if (!email || !isValidEmail(email)) {
    return { sent: false, email: null, errorKey: "generic" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const nextPath =
    locale === "es" ? "/nueva-contrasena" : "/en/nueva-contrasena";

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=${nextPath}`,
  });

  if (error) {
    return { sent: false, email: null, errorKey: mapErrorKey(error.message) };
  }

  return { sent: true, email, errorKey: null };
}

// ─── Reset password ──────────────────────────────────────────
export async function resetPasswordAction(
  prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const password = ((formData.get("password") as string) ?? "").slice(0, 128);
  const locale = (formData.get("locale") as string) ?? "es";

  if (!isValidPassword(password)) {
    return { success: false, errorKey: "weak_password" };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { success: false, errorKey: mapErrorKey(error.message) };
  }

  redirect(`${getPrefix(locale)}/dashboard`);
}

// ─── Logout ──────────────────────────────────────────────────
export async function logoutAction(formData: FormData): Promise<void> {
  const locale = (formData.get("locale") as string) ?? "es";

  const supabase = createClient();
  await supabase.auth.signOut();

  redirect(`${getPrefix(locale)}/login`);
}
