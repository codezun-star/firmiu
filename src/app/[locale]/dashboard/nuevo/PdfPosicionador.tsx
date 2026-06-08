"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface PosicionFirma {
  pagina: number;
  campo_x: number;
  campo_y: number;
  campo_ancho: number;
  campo_alto: number;
}

export interface FirmanteLocal {
  nombre: string;
  correo: string;
  posicion: PosicionFirma | null;
}

// Color por índice de firmante
const SIGNER_COLORS = [
  "#1a3c5e",
  "#F97316",
  "#10B981",
  "#8B5CF6",
  "#EF4444",
];

const FIELD_W = 0.38;
const FIELD_H = 0.10;

interface Props {
  file: File;
  firmantes: FirmanteLocal[];
  activeSigner: number;
  onPlace: (signerIndex: number, pos: PosicionFirma) => void;
  positionHint: string;
  positionActive: (n: number) => string;
  positionPlaced: (n: number) => string;
  positionNotPlaced: string;
}

export default function PdfPosicionador({
  file,
  firmantes,
  activeSigner,
  onPlace,
  positionHint,
  positionActive,
  positionPlaced,
  positionNotPlaced,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef<{ getPage: (n: number) => Promise<unknown> } | null>(null);

  // Renderiza una página del PDF en el canvas
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfRef.current || !canvasRef.current) return;
    setLoading(true);
    try {
      const page = await pdfRef.current.getPage(pageNum) as {
        getViewport: (o: { scale: number }) => { width: number; height: number };
        render: (o: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => { promise: Promise<void> };
      };
      const container = containerRef.current;
      const containerW = (container?.clientWidth ?? 0) || 640;
      const unscaledVP = page.getViewport({ scale: 1 });
      const scale = containerW / unscaledVP.width;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      await page.render({ canvasContext: ctx, viewport }).promise;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga el PDF cuando el archivo cambia
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const pdfjsLib = await import("pdfjs-dist");
      // Cargamos el worker desde la API route (sirve desde node_modules, no depende de public/)
      // La blob URL se permite por worker-src blob: y script-src blob: en el CSP
      try {
        const res = await fetch("/api/pdf-worker");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
      } catch {
        // fallback: sin worker (main thread)
        pdfjsLib.GlobalWorkerOptions.workerSrc = "";
      }
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      if (cancelled) return;
      pdfRef.current = pdf as unknown as { getPage: (n: number) => Promise<unknown> };
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      await renderPage(1);
    })();
    return () => { cancelled = true; };
  }, [file, renderPage]);

  // Re-renderiza cuando cambia la página
  useEffect(() => {
    if (pdfRef.current) renderPage(currentPage);
  }, [currentPage, renderPage]);

  // Maneja clic en el canvas para colocar campo de firma
  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;
    // Centrar el campo en el clic, manteniendo dentro del canvas
    const fw = FIELD_W * canvas.width;
    const fh = FIELD_H * canvas.height;
    const rawX = (clickX - fw / 2) / canvas.width;
    const rawY = (clickY - fh / 2) / canvas.height;
    const campo_x = Math.max(0, Math.min(1 - FIELD_W, rawX));
    const campo_y = Math.max(0, Math.min(1 - FIELD_H, rawY));
    onPlace(activeSigner, {
      pagina: currentPage,
      campo_x,
      campo_y,
      campo_ancho: FIELD_W,
      campo_alto: FIELD_H,
    });
  }

  // Calcula posición del overlay en CSS (% del canvas)
  function fieldStyle(pos: PosicionFirma, canvasW: number, canvasH: number, index: number) {
    if (pos.pagina !== currentPage) return null;
    const color = SIGNER_COLORS[index % SIGNER_COLORS.length];
    const left = pos.campo_x * 100;
    const top = pos.campo_y * 100;
    const width = pos.campo_ancho * 100;
    const height = pos.campo_alto * 100;
    return { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`, borderColor: color, color };
  }

  const activeColor = SIGNER_COLORS[activeSigner % SIGNER_COLORS.length];

  return (
    <div className="flex flex-col gap-3">
      {/* Hint */}
      <div
        className="text-[13px] px-3 py-2 rounded-[9px] font-medium text-center"
        style={{ background: `${activeColor}15`, color: activeColor, border: `1px solid ${activeColor}30` }}
      >
        {positionActive(activeSigner + 1)}
      </div>

      {/* Canvas + overlays */}
      <div ref={containerRef} className="relative w-full rounded-[9px] overflow-hidden border border-[#E5E7EB] bg-[#F8F9FA]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
            <div className="w-6 h-6 border-2 border-[#1a3c5e] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full block cursor-crosshair"
          onClick={handleCanvasClick}
        />
        {/* Overlays de campos posicionados */}
        {canvasRef.current && firmantes.map((f, i) => {
          if (!f.posicion) return null;
          const style = fieldStyle(f.posicion, canvasRef.current!.width, canvasRef.current!.height, i);
          if (!style) return null;
          return (
            <div
              key={i}
              className="absolute border-2 rounded-[4px] flex items-center justify-center pointer-events-none"
              style={{ ...style, background: `${style.borderColor}18` }}
            >
              <span className="text-[11px] font-bold px-1" style={{ color: style.color }}>
                {i + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Navegación de páginas */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-[13px] rounded-[9px] border border-[#E5E7EB] text-[#374151] disabled:opacity-40 hover:bg-[#F3F4F6] transition-colors"
          >
            ←
          </button>
          <span className="text-[13px] text-[#6B7280]">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-[13px] rounded-[9px] border border-[#E5E7EB] text-[#374151] disabled:opacity-40 hover:bg-[#F3F4F6] transition-colors"
          >
            →
          </button>
        </div>
      )}

      {/* Estado de posicionamiento por firmante */}
      <div className="flex flex-col gap-1">
        {firmantes.map((f, i) => {
          const color = SIGNER_COLORS[i % SIGNER_COLORS.length];
          const isActive = i === activeSigner;
          const placed = !!f.posicion;
          return (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-[9px] text-[13px]"
              style={{
                background: isActive ? `${color}12` : "#F9FAFB",
                border: `1px solid ${isActive ? color + "40" : "#E5E7EB"}`,
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ background: color }}
              >
                {i + 1}
              </span>
              <span className="font-medium text-[#374151] truncate flex-1">
                {f.nombre || `Firmante ${i + 1}`}
              </span>
              {placed ? (
                <span className="text-[#10B981] text-[11px] font-medium shrink-0">
                  ✓ {positionPlaced(f.posicion!.pagina)}
                </span>
              ) : (
                <span className="text-[#9CA3AF] text-[11px] shrink-0">{positionNotPlaced}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Hint general */}
      <p className="text-[12px] text-[#9CA3AF] text-center">{positionHint}</p>
    </div>
  );
}
