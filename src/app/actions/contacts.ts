"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidEmail, isValidUUID, sanitizeText } from "@/lib/security";

export interface ContactResult {
  error: string | null;
}

export async function addContactAction(formData: FormData): Promise<ContactResult> {
  const nombre = sanitizeText((formData.get("nombre") as string) ?? "", 100);
  const correo = ((formData.get("correo") as string) ?? "").trim().toLowerCase().slice(0, 320);
  const empresa = sanitizeText((formData.get("empresa") as string) ?? "", 100) || null;
  const locale  = (formData.get("locale")  as string) ?? "es";

  if (!nombre) return { error: "name_required" };
  if (!isValidEmail(correo)) return { error: "email_invalid" };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "generic" };

  const { error } = await supabase
    .from("contactos")
    .insert({ owner_id: user.id, nombre, correo, empresa });

  if (error?.code === "23505") return { error: "exists" };
  if (error) return { error: "generic" };

  const prefix = locale === "es" ? "" : `/${locale}`;
  revalidatePath(`${prefix}/dashboard/contactos`);
  return { error: null };
}

export async function deleteContactAction(
  id: string,
  locale: string
): Promise<ContactResult> {
  if (!isValidUUID(id)) return { error: "generic" };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "generic" };

  const { error } = await supabase
    .from("contactos")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);
  if (error) return { error: "generic" };

  const prefix = locale === "es" ? "" : `/${locale}`;
  revalidatePath(`${prefix}/dashboard/contactos`);
  return { error: null };
}
