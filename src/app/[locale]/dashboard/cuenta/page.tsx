import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./SettingsClient";

interface CuentaPageProps {
  params: { locale: string };
}

export default async function CuentaPage({ params: { locale } }: CuentaPageProps) {
  setRequestLocale(locale);

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const nombre   = (user?.user_metadata?.nombre as string | undefined) ?? "";
  const email    = user?.email ?? "";
  const isGoogle = user?.app_metadata?.provider === "google";
  const userId   = user?.id ?? "";

  // Docs count this calendar month — filtered by owner
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();

  const { count: docsThisMonth } = await supabase
    .from("documentos")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", userId)
    .gte("creado_en", inicioMes);

  // Subscription (gracefully handles migration not applied yet)
  const { data: sub } = await supabase
    .from("suscripciones")
    .select("plan, limite_documentos, estado")
    .eq("owner_id", userId)
    .maybeSingle();

  const activeSub  = sub?.estado === "active" ? sub : null;
  const plan       = activeSub?.plan ?? "free";
  const docsLimit  = activeSub?.limite_documentos ?? 3;

  return (
    <SettingsClient
      locale={locale}
      nombre={nombre}
      email={email}
      isGoogle={isGoogle}
      userId={userId}
      docsThisMonth={docsThisMonth ?? 0}
      plan={plan}
      docsLimit={docsLimit}
    />
  );
}
