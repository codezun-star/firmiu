import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import FirmasClient from "./FirmasClient";

export const dynamic = "force-dynamic";

interface FirmasPageProps {
  params: { locale: string };
  searchParams: { page?: string };
}

export type FirmaWithDoc = {
  id: string;
  firmado_en: string;
  ip: string | null;
  navegador: string | null;
  sistema_operativo: string | null;
  ubicacion: string | null;
  docTitulo: string;
  docNombre: string;
  docCorreo: string;
};

const PAGE_SIZE = 10;

export default async function FirmasPage({ params: { locale }, searchParams }: FirmasPageProps) {
  setRequestLocale(locale);

  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // Fetch user's docs for ownership mapping (server client respects RLS)
  const { data: userDocs } = await supabase
    .from("documentos")
    .select("id, titulo, nombre_destinatario, correo_destinatario")
    .eq("owner_id", userId)
    .eq("oculto", false);

  const docMap = new Map((userDocs ?? []).map(d => [d.id, d]));
  const docIds = (userDocs ?? []).map(d => d.id);

  let firmas: FirmaWithDoc[] = [];
  let totalCount = 0;

  if (docIds.length > 0) {
    const { data, count } = await admin
      .from("firmas")
      .select("id, documento_id, firmado_en, ip, navegador, sistema_operativo, ubicacion", { count: "exact" })
      .eq("verificado", true)
      .eq("oculto", false)
      .in("documento_id", docIds)
      .order("firmado_en", { ascending: false })
      .range(from, to);

    totalCount = count ?? 0;

    firmas = (data ?? []).map(f => {
      const doc = docMap.get(f.documento_id);
      return {
        id: f.id,
        firmado_en: f.firmado_en,
        ip: f.ip,
        navegador: f.navegador,
        sistema_operativo: f.sistema_operativo,
        ubicacion: f.ubicacion,
        docTitulo: doc?.titulo ?? "—",
        docNombre: doc?.nombre_destinatario ?? "—",
        docCorreo: doc?.correo_destinatario ?? "",
      };
    });
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <FirmasClient
      firmas={firmas}
      page={page}
      totalPages={totalPages}
      totalCount={totalCount}
      locale={locale}
    />
  );
}
