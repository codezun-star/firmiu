import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import DocumentosClient, { type DocumentoRow } from "./DocumentosClient";

export const dynamic = "force-dynamic";

interface DocumentosPageProps {
  params: { locale: string };
  searchParams: { page?: string };
}

const PAGE_SIZE = 10;

export default async function DocumentosPage({ params: { locale }, searchParams }: DocumentosPageProps) {
  setRequestLocale(locale);

  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  /* ── Paginated docs + total count ── */
  const { data: docs, count: totalCount } = await supabase
    .from("documentos")
    .select("id, titulo, nombre_destinatario, correo_destinatario, estado, url_pdf_original, url_pdf_firmado, token, creado_en", { count: "exact" })
    .eq("owner_id", userId)
    .eq("oculto", false)
    .order("creado_en", { ascending: false })
    .range(from, to);

  const rows = docs ?? [];
  const total = totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  /* ── Status counts (for tab badges, across all pages) ── */
  const [r1, r2, r3] = await Promise.all([
    supabase.from("documentos").select("id", { count: "exact", head: true }).eq("owner_id", userId).eq("oculto", false).eq("estado", "pendiente"),
    supabase.from("documentos").select("id", { count: "exact", head: true }).eq("owner_id", userId).eq("oculto", false).eq("estado", "visto"),
    supabase.from("documentos").select("id", { count: "exact", head: true }).eq("owner_id", userId).eq("oculto", false).eq("estado", "firmado"),
  ]);
  const statusCounts = {
    todos:     total,
    pendiente: r1.count ?? 0,
    visto:     r2.count ?? 0,
    firmado:   r3.count ?? 0,
  };

  /* ── Batch-generate signed URLs for original PDFs ── */
  const origPaths = rows
    .filter(d => d.url_pdf_original)
    .map(d => d.url_pdf_original as string);

  const { data: origUrls } = origPaths.length > 0
    ? await admin.storage.from("pdfs-originales").createSignedUrls(origPaths, 3600)
    : { data: null };

  /* ── Batch-generate signed URLs for signed PDFs ── */
  const firmPaths = rows
    .filter(d => d.url_pdf_firmado)
    .map(d => d.url_pdf_firmado as string);

  const { data: firmUrls } = firmPaths.length > 0
    ? await admin.storage.from("pdfs-firmados").createSignedUrls(firmPaths, 3600)
    : { data: null };

  /* ── Merge URLs into rows ── */
  const documents: DocumentoRow[] = rows.map(doc => ({
    id:                    doc.id,
    titulo:                doc.titulo,
    nombre_destinatario:   doc.nombre_destinatario,
    correo_destinatario:   doc.correo_destinatario,
    estado:                doc.estado as DocumentoRow["estado"],
    token:                 doc.token,
    creado_en:             doc.creado_en,
    signedOriginalUrl:     origUrls?.find(u => u.path === doc.url_pdf_original)?.signedUrl ?? null,
    signedFirmadoUrl:      firmUrls?.find(u => u.path === doc.url_pdf_firmado)?.signedUrl ?? null,
  }));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <DocumentosClient
      documents={documents}
      locale={locale}
      appUrl={appUrl}
      page={page}
      totalPages={totalPages}
      totalCount={total}
      statusCounts={statusCounts}
    />
  );
}
