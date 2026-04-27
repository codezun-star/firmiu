import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import ContactosClient from "./ContactosClient";

export const dynamic = "force-dynamic";

interface ContactosPageProps {
  params: { locale: string };
  searchParams: { page?: string };
}

const PAGE_SIZE = 10;

export default async function ContactosPage({ params: { locale }, searchParams }: ContactosPageProps) {
  setRequestLocale(locale);

  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: contactos, count: totalCount } = await supabase
    .from("contactos")
    .select("id, nombre, correo, empresa, creado_en", { count: "exact" })
    .eq("owner_id", userId)
    .eq("oculto", false)
    .order("nombre", { ascending: true })
    .range(from, to);

  const total = totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <ContactosClient
      locale={locale}
      contactos={contactos ?? []}
      page={page}
      totalPages={totalPages}
      totalCount={total}
    />
  );
}
