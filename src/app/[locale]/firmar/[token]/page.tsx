import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import FirmarClient from "./FirmarClient";

interface FirmarPageProps {
  params: { locale: string; token: string };
}

export default async function FirmarPage({ params: { locale, token } }: FirmarPageProps) {
  setRequestLocale(locale);

  const admin = createAdminClient();

  const { data: doc } = await admin
    .from("documentos")
    .select("id, owner_id, titulo, nombre_destinatario, estado, url_pdf_original")
    .eq("token", token)
    .single();

  if (!doc) notFound();

  // Generate a signed URL for the PDF viewer (1 hour)
  let pdfUrl: string | null = null;
  if (doc.url_pdf_original) {
    const { data: urlData } = await admin.storage
      .from("pdfs-originales")
      .createSignedUrl(doc.url_pdf_original, 3600);
    pdfUrl = urlData?.signedUrl ?? null;
  }

  // If already signed, fetch the signing date for the AlreadySigned UI
  let fechaFirma: string | null = null;
  if (doc.estado === "firmado") {
    const { data: firmaData } = await admin
      .from("firmas")
      .select("firmado_en")
      .eq("documento_id", doc.id)
      .single();
    fechaFirma = firmaData?.firmado_en ?? null;
  }

  // Mark as viewed if still pending
  if (doc.estado === "pendiente") {
    await admin
      .from("documentos")
      .update({ estado: "visto" })
      .eq("id", doc.id);
  }

  return (
    <FirmarClient
      locale={locale}
      token={token}
      titulo={doc.titulo}
      nombreDestinatario={doc.nombre_destinatario}
      estado={doc.estado}
      pdfUrl={pdfUrl}
      fechaFirma={fechaFirma}
    />
  );
}
