import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import DocumentosClient, { type DocumentoRow } from "./DocumentosClient";

interface DocumentosPageProps {
  params: { locale: string };
}

export default async function DocumentosPage({ params: { locale } }: DocumentosPageProps) {
  setRequestLocale(locale);

  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  /* ── Fetch documents for the current user — explicit owner_id filter ── */
  const { data: docs } = await supabase
    .from("documentos")
    .select("id, titulo, nombre_destinatario, correo_destinatario, estado, url_pdf_original, url_pdf_firmado, token, creado_en")
    .eq("owner_id", userId)
    .order("creado_en", { ascending: false });

  const rows = docs ?? [];

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
    />
  );
}
