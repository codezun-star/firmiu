import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import ContactosClient from "./ContactosClient";

interface ContactosPageProps {
  params: { locale: string };
}

export default async function ContactosPage({ params: { locale } }: ContactosPageProps) {
  setRequestLocale(locale);

  const supabase = createClient();

  const { data: contactos } = await supabase
    .from("contactos")
    .select("id, nombre, correo, empresa, creado_en")
    .order("nombre", { ascending: true });

  return <ContactosClient locale={locale} contactos={contactos ?? []} />;
}
