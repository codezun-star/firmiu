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

  // Try firmantes.token first (new multi-signer flow)
  const { data: firmante } = await admin
    .from("firmantes")
    .select("id, documento_id, nombre, estado, pagina, campo_x, campo_y, campo_ancho, campo_alto, bloqueado")
    .eq("token", token)
    .maybeSingle();

  if (firmante) {
    // New multi-signer flow
    const { data: doc } = await admin
      .from("documentos")
      .select("id, titulo, url_pdf_original")
      .eq("id", firmante.documento_id)
      .single();

    if (!doc) notFound();

    let pdfUrl: string | null = null;
    if (doc.url_pdf_original) {
      const { data: urlData } = await admin.storage
        .from("pdfs-originales")
        .createSignedUrl(doc.url_pdf_original, 3600);
      pdfUrl = urlData?.signedUrl ?? null;
    }

    let fechaFirma: string | null = null;
    if (firmante.estado === "firmado") {
      const { data: f } = await admin
        .from("firmantes")
        .select("firmado_en")
        .eq("id", firmante.id)
        .single();
      fechaFirma = (f as { firmado_en: string | null } | null)?.firmado_en ?? null;
    }

    // Mark as viewed
    if (firmante.estado === "pendiente") {
      await admin.from("firmantes").update({ estado: "visto" }).eq("id", firmante.id);
    }

    return (
      <FirmarClient
        locale={locale}
        token={token}
        titulo={doc.titulo}
        nombreDestinatario={firmante.nombre}
        estado={firmante.estado}
        pdfUrl={pdfUrl}
        fechaFirma={fechaFirma}
        signatureField={firmante.estado !== "firmado" ? {
          pagina: firmante.pagina,
          campo_x: firmante.campo_x,
          campo_y: firmante.campo_y,
          campo_ancho: firmante.campo_ancho,
          campo_alto: firmante.campo_alto,
        } : null}
      />
    );
  }

  // Legacy flow: documentos.token
  const { data: doc } = await admin
    .from("documentos")
    .select("id, owner_id, titulo, nombre_destinatario, estado, url_pdf_original")
    .eq("token", token)
    .single();

  if (!doc) notFound();

  let pdfUrl: string | null = null;
  if (doc.url_pdf_original) {
    const { data: urlData } = await admin.storage
      .from("pdfs-originales")
      .createSignedUrl(doc.url_pdf_original, 3600);
    pdfUrl = urlData?.signedUrl ?? null;
  }

  let fechaFirma: string | null = null;
  if (doc.estado === "firmado") {
    const { data: firmaData } = await admin
      .from("firmas")
      .select("firmado_en")
      .eq("documento_id", doc.id)
      .single();
    fechaFirma = firmaData?.firmado_en ?? null;
  }

  if (doc.estado === "pendiente") {
    await admin.from("documentos").update({ estado: "visto" }).eq("id", doc.id);
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
      signatureField={null}
    />
  );
}
