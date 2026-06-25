"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidPassword, sanitizeText } from "@/lib/security";
import { getPrefix } from "@/lib/utils";

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

  const prefix = getPrefix(locale);
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
        const res = await fetch(
          `${paddleBase}/subscriptions/${sub.paddle_subscription_id}/cancel`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ effective_from: "immediately" }),
          }
        );
        // fetch does NOT throw on 4xx/5xx — check explicitly. If the cancel
        // fails, Paddle keeps billing a deleted account (chargeback risk), so
        // make it loud for manual follow-up instead of swallowing it.
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          console.error(
            "[deleteAccount] Paddle cancel FALLÓ — la suscripción podría seguir cobrando. sub:",
            sub.paddle_subscription_id, "status:", res.status, body.slice(0, 300)
          );
        }
      } catch (e) {
        // Non-fatal: continue with deletion, but record it.
        console.error(
          "[deleteAccount] Paddle cancel error de red — la suscripción podría seguir cobrando. sub:",
          sub.paddle_subscription_id, e
        );
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

    // 4. Delete the user's stored PDFs. The DB cascade does not touch Storage,
    //    so without this the original + signed PDFs (with the signer's IP and
    //    location in the audit trail) would persist after account deletion.
    for (const bucket of ["pdfs-originales", "pdfs-firmados"]) {
      try {
        const { data: files } = await admin.storage.from(bucket).list(user.id, { limit: 1000 });
        if (files && files.length > 0) {
          await admin.storage
            .from(bucket)
            .remove(files.map((f) => `${user.id}/${f.name}`));
        }
      } catch {
        // Non-fatal: account deletion must proceed even if storage cleanup fails
      }
    }

    // 5. Delete subscription record
    await admin
      .from("suscripciones")
      .delete()
      .eq("owner_id", user.id);

    // 6. Delete user from Supabase Auth
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;

    return { success: true };
  } catch (e) {
    console.error("[deleteAccount]", e);
    return { errorKey: "delete_failed" };
  }
}

export interface CancelSubscriptionResult {
  success?: boolean;
  errorKey?: string;
}

export async function cancelSubscriptionAction(): Promise<CancelSubscriptionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { errorKey: "not_authenticated" };

  const admin = createAdminClient();

  const { data: sub } = await admin
    .from("suscripciones")
    .select("paddle_subscription_id, plan")
    .eq("owner_id", user.id)
    .single();

  if (!sub?.paddle_subscription_id) return { errorKey: "no_subscription" };

  const paddleBase = process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";

  try {
    const response = await fetch(
      `${paddleBase}/subscriptions/${sub.paddle_subscription_id}/cancel`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PADDLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ effective_from: "next_billing_period" }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("[cancelSubscription] Paddle error:", err);
      return { errorKey: "paddle_error" };
    }

    await admin
      .from("suscripciones")
      .update({ estado: "canceling" })
      .eq("owner_id", user.id);

    return { success: true };
  } catch (e) {
    console.error("[cancelSubscription]", e);
    return { errorKey: "cancel_failed" };
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
