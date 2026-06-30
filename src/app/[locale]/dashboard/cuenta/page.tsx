import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

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

  // Rows created this calendar month (used only for the free plan)
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();

  const { count: rowsThisMonth } = await supabase
    .from("documentos")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", userId)
    .gte("creado_en", inicioMes);

  // Subscription (gracefully handles migration not applied yet)
  const { data: sub } = await supabase
    .from("suscripciones")
    .select("plan, limite_documentos, estado, documentos_mes, periodo_inicio, periodo_fin")
    .eq("owner_id", userId)
    .maybeSingle();

  const isPaidActive = sub?.estado === "active" || sub?.estado === "canceling";
  const plan         = isPaidActive ? (sub?.plan ?? "free") : "free";
  const docsLimit    = isPaidActive ? (sub?.limite_documentos ?? 3) : 3;
  const estado       = sub?.estado ?? "none";
  // Consumo real del mes: en planes de pago es el contador `documentos_mes`
  // (cuenta cada PDF fusionado); en Free es el número de filas (Free no fusiona).
  const docsThisMonth = isPaidActive
    ? ((sub?.documentos_mes as number | null) ?? 0)
    : (rowsThisMonth ?? 0);
  const periodoInicio = isPaidActive ? ((sub?.periodo_inicio as string | null) ?? null) : null;
  const periodoFin    = isPaidActive ? ((sub?.periodo_fin as string | null) ?? null) : null;

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
      estado={estado}
      periodoInicio={periodoInicio}
      periodoFin={periodoFin}
    />
  );
}
