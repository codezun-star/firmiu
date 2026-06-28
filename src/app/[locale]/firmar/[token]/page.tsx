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
    .select("id, documento_id, nombre, estado, orden, pagina, campo_x, campo_y, campo_ancho, campo_alto, bloqueado")
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

    // Sequential mode: block the signer until everyone before them has signed.
    // modo_firma is read separately + tolerantly so the signing page keeps
    // working even if migration 012 hasn't been applied yet (defaults to paralelo).
    let waiting = false;
    if (firmante.estado !== "firmado") {
      const { data: modoRow } = await admin
        .from("documentos")
        .select("modo_firma")
        .eq("id", doc.id)
        .maybeSingle();
      const modoFirma = (modoRow as { modo_firma?: string } | null)?.modo_firma ?? "paralelo";
      if (modoFirma === "secuencial") {
        const { data: earlier } = await admin
          .from("firmantes")
          .select("estado")
          .eq("documento_id", doc.id)
          .eq("oculto", false)
          .lt("orden", firmante.orden ?? 1);
        waiting = (earlier ?? []).some((e) => e.estado !== "firmado");
      }
    }

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

    // Mark as viewed (only when it's actually this signer's turn). Also bump the
    // parent document to "visto" so the owner's dashboard reflects it was opened.
    if (!waiting && firmante.estado === "pendiente") {
      await admin.from("firmantes").update({ estado: "visto" }).eq("id", firmante.id);
      await admin.from("documentos").update({ estado: "visto" }).eq("id", doc.id).eq("estado", "pendiente");
    }

    return (
      <FirmarClient
        locale={locale}
        token={token}
        titulo={doc.titulo}
        nombreDestinatario={firmante.nombre}
        estado={firmante.estado}
        waiting={waiting}
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

  // El flujo legacy (documentos.token + tabla `firmas`) fue eliminado. Un token
  // que no corresponde a un firmante es inválido.
  notFound();
}
