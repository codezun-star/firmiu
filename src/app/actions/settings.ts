"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidPassword, sanitizeText } from "@/lib/security";

export interface SettingsResult {
  error: string | null;
}

export async function updateProfileAction(formData: FormData): Promise<SettingsResult> {
  const nombre = sanitizeText((formData.get("nombre") as string) ?? "", 100);
  const locale  = (formData.get("locale")  as string) ?? "es";

  if (!nombre) return { error: "name_required" };

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ data: { nombre } });
  if (error) return { error: "generic" };

  const prefix = locale === "es" ? "" : `/${locale}`;
  revalidatePath(`${prefix}/dashboard/cuenta`);
  return { error: null };
}

export async function updatePasswordAction(formData: FormData): Promise<SettingsResult> {
  const password = ((formData.get("password") as string) ?? "").slice(0, 128);
  const confirm  = ((formData.get("confirm")  as string) ?? "").slice(0, 128);

  if (!isValidPassword(password)) return { error: "password_short" };
  if (password !== confirm) return { error: "passwords_mismatch" };

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "generic" };

  return { error: null };
}
