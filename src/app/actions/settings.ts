"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

export interface DeleteAccountResult {
  success?: boolean;
  errorKey?: string;
}

export async function deleteAccountAction(): Promise<DeleteAccountResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { errorKey: "not_authenticated" };

  const admin = createAdminClient();

  try {
    // 1. Cancel Paddle subscription if exists (non-fatal)
    const { data: sub } = await admin
      .from("suscripciones")
      .select("paddle_subscription_id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (sub?.paddle_subscription_id) {
      const paddleBase = process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
        ? "https://api.paddle.com"
        : "https://sandbox-api.paddle.com";
      try {
        await fetch(`${paddleBase}/subscriptions/${sub.paddle_subscription_id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${process.env.PADDLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ effective_from: "immediately" }),
        });
      } catch {
        // Non-fatal: continue with deletion
      }
    }

    // 2. Soft-delete documents (preserve for legal reasons)
    await admin
      .from("documentos")
      .update({ oculto: true })
      .eq("owner_id", user.id);

    // 3. Delete contacts (no legal retention needed)
    await admin
      .from("contactos")
      .delete()
      .eq("owner_id", user.id);

    // 4. Delete subscription record
    await admin
      .from("suscripciones")
      .delete()
      .eq("owner_id", user.id);

    // 5. Delete user from Supabase Auth
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;

    return { success: true };
  } catch (e) {
    console.error("[deleteAccount]", e);
    return { errorKey: "delete_failed" };
  }
}

export async function updatePasswordAction(formData: FormData): Promise<SettingsResult> {
  const password = ((formData.get("password") as string) ?? "").slice(0, 128);
  const confirm  = ((formData.get("confirm")  as string) ?? "").slice(0, 128);

  if (!isValidPassword(password)) return { error: "password_short" };
  if (password !== confirm) return { error: "passwords_mismatch" };

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "generic" };

  revalidatePath("/dashboard/cuenta");
  revalidatePath("/en/dashboard/cuenta");
  return { error: null };
}
