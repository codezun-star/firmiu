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
  // Un firmante puede tener VARIOS lugares de firma en el documento unificado.
  posiciones: PosicionFirma[];
}

const SIGNER_COLORS = ["#1a3c5e", "#F97316", "#10B981", "#8B5CF6", "#EF4444"];
// Signature-sized field (relative to page). Kept small so the signature sits
// naturally on a signature line. The stamp (drawSignatureOnPage) scales to the
// stored field, so these two values define the on-document size.
const FIELD_W = 0.20;
const FIELD_H = 0.05;

interface Props {
  file: File;
  firmantes: FirmanteLocal[];
  activeSigner: number;
  onSelectSigner: (i: number) => void;
  onAddSigner: () => void;
  maxSigners: number;
  signerFallback: (n: number) => string;
  addSignerLabel: string;
  // Field editing
  onAddField: (signerIndex: number, pos: PosicionFirma) => void;
  onMoveField: (signerIndex: number, fieldIndex: number, pos: PosicionFirma) => void;
  onRemoveField: (signerIndex: number, fieldIndex: number) => void;
  positionHint: string;
  positionActive: (n: number) => string;
  fieldsCount: (n: number) => string;
  noFields: string;
}

export default function PdfPosicionador({
  file,
  firmantes,
  activeSigner,
  onSelectSigner,
  onAddSigner,
  maxSigners,
  signerFallback,
  addSignerLabel,
  onAddField,
  onMoveField,
  onRemoveField,
  positionHint,
  positionActive,
  fieldsCount,
  noFields,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pdfFailed, setPdfFailed] = useState(false);
  const [disp, setDisp] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const ZOOM_MIN = 0.6, ZOOM_MAX = 2.5, ZOOM_STEP = 0.2;
  const pdfRef = useRef<{ getPage: (n: number) => Promise<unknown> } | null>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);
  const hasRenderedRef = useRef(false);

  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfRef.current || !canvasRef.current) return;
    if (renderTaskRef.current) { try { renderTaskRef.current.cancel(); } catch { /* ignore */ } renderTaskRef.current = null; }
    if (!hasRenderedRef.current) setLoading(true);
    try {
      const page = await pdfRef.current.getPage(pageNum) as {
        getViewport: (o: { scale: number }) => { width: number; height: number };
        render: (o: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => { promise: Promise<void>; cancel: () => void };
      };
      const pane = paneRef.current;
      const paneW = Math.max(280, (pane?.clientWidth ?? 0) - 32);
      const unscaled = page.getViewport({ scale: 1 });
      const aspect = unscaled.height / unscaled.width;

      const maxH = Math.max(380, Math.round((typeof window !== "undefined" ? window.innerHeight : 900) * 0.8));
      let displayW = paneW;
      let displayH = displayW * aspect;
      if (displayH > maxH) { displayH = maxH; displayW = displayH / aspect; }
      displayW *= zoomRef.current;
      displayH *= zoomRef.current;

      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
      const viewport = page.getViewport({ scale: (displayW / unscaled.width) * dpr });
      const canvas = canvasRef.current;
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      setDisp({ w: Math.round(displayW), h: Math.round(displayH) });
      const task = page.render({ canvasContext: ctx, viewport });
      renderTaskRef.current = task;
      await task.promise;
      renderTaskRef.current = null;
      hasRenderedRef.current = true;
    } catch (err) {
      if ((err as { name?: string })?.name !== "RenderingCancelledException") {
        console.error("[PdfPosicionador] page render failed:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fallbackTimer = setTimeout(() => {
      if (!cancelled) { setLoading(false); setPdfFailed(true); }
    }, 10000);

    (async () => {
      setLoading(true);
      setPdfFailed(false);
      try {
        const PromiseAny = Promise as any; // polyfill assignment needs any
        if (typeof PromiseAny["try"] !== "function") {
          PromiseAny["try"] = function <T>(
            fn: (...a: unknown[]) => T | PromiseLike<T>,
            ...args: unknown[]
          ): Promise<T> {
            return new Promise<T>((resolve, reject) => {
              try { resolve(fn(...args)); } catch (e) { reject(e); }
            });
          };
        }

        const pdfjsLib = await import("pdfjs-dist");

        let workerSrc = "/pdf.worker.min.mjs";
        try {
          const res = await fetch(workerSrc);
          if (res.ok) {
            const code = await res.text();
            workerSrc = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
          }
        } catch { /* keep path fallback */ }
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (cancelled) return;
        clearTimeout(fallbackTimer);
        pdfRef.current = pdf as unknown as { getPage: (n: number) => Promise<unknown> };
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        await renderPage(1);
      } catch (err) {
        console.error("[PdfPosicionador] PDF preview failed:", err);
        if (!cancelled) {
          clearTimeout(fallbackTimer);
          setLoading(false);
          setPdfFailed(true);
        }
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
    };
  }, [file, renderPage]);

  useEffect(() => {
    if (pdfRef.current && !pdfFailed) renderPage(currentPage);
  }, [currentPage, renderPage, pdfFailed]);

  useEffect(() => {
    zoomRef.current = zoom;
    if (pdfRef.current && !pdfFailed) renderPage(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  useEffect(() => {
    const pane = paneRef.current;
    if (!pane || typeof ResizeObserver === "undefined") return;
    let raf = 0;
    let first = true;
    const ro = new ResizeObserver(() => {
      if (first) { first = false; return; }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (pdfRef.current && !pdfFailed) renderPage(currentPage);
      });
    });
    ro.observe(pane);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [renderPage, currentPage, pdfFailed]);

  // ── Add a field for the active signer by clicking the document ──
  function posFromPoint(clientX: number, clientY: number, rect: DOMRect): PosicionFirma {
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;
    const fw = FIELD_W * rect.width;
    const fh = FIELD_H * rect.height;
    return {
      pagina: currentPage,
      campo_x: Math.max(0, Math.min(1 - FIELD_W, (clickX - fw / 2) / rect.width)),
      campo_y: Math.max(0, Math.min(1 - FIELD_H, (clickY - fh / 2) / rect.height)),
      campo_ancho: FIELD_W,
      campo_alto: FIELD_H,
    };
  }

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    onAddField(activeSigner, posFromPoint(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect()));
  }

  // ── Drag a field to move it (mouse + touch) ──
  const dragRef = useRef<{ signer: number; field: number } | null>(null);
  const grabOffset = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  function onBoxPointerDown(e: React.PointerEvent, signer: number, field: number) {
    e.stopPropagation();
    e.preventDefault();
    onSelectSigner(signer);
    const rect = canvasRef.current?.getBoundingClientRect();
    const pos = firmantes[signer]?.posiciones[field];
    if (!rect || !pos) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    grabOffset.current = { dx: px - pos.campo_x, dy: py - pos.campo_y };
    dragRef.current = { signer, field };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onBoxPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    onMoveField(d.signer, d.field, {
      pagina: currentPage,
      campo_x: Math.max(0, Math.min(1 - FIELD_W, px - grabOffset.current.dx)),
      campo_y: Math.max(0, Math.min(1 - FIELD_H, py - grabOffset.current.dy)),
      campo_ancho: FIELD_W,
      campo_alto: FIELD_H,
    });
  }

  function onBoxPointerUp(e: React.PointerEvent) {
    dragRef.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  function boxStyle(pos: PosicionFirma, signerIndex: number) {
    const color = SIGNER_COLORS[signerIndex % SIGNER_COLORS.length];
    return {
      left: `${pos.campo_x * 100}%`,
      top: `${pos.campo_y * 100}%`,
      width: `${pos.campo_ancho * 100}%`,
      height: `${pos.campo_alto * 100}%`,
      borderColor: color,
      color,
    };
  }

  const activeColor = SIGNER_COLORS[activeSigner % SIGNER_COLORS.length];

  // Flatten every signer's fields on the current page into draggable boxes.
  const overlays = firmantes.flatMap((f, si) =>
    f.posiciones.map((pos, fi) => {
      if (pos.pagina !== currentPage) return null;
      const style = boxStyle(pos, si);
      const isActive = si === activeSigner;
      return (
        <div key={`${si}-${fi}`}
          className="absolute border-2 rounded-[4px] flex items-center justify-center cursor-move touch-none transition-shadow"
          style={{
            ...style,
            background: `${style.borderColor}${isActive ? "22" : "14"}`,
            opacity: isActive ? 1 : 0.85,
            boxShadow: isActive ? `0 0 0 2px ${style.borderColor}66` : "none",
            zIndex: isActive ? 2 : 1,
          }}
          onPointerDown={(e) => onBoxPointerDown(e, si, fi)}
          onPointerMove={onBoxPointerMove}
          onPointerUp={onBoxPointerUp}
          onPointerCancel={onBoxPointerUp}
        >
          <span className="text-[11px] font-bold px-1 pointer-events-none" style={{ color: style.color }}>{si + 1}</span>
          {/* Remove this field */}
          <button type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onRemoveField(si, fi); }}
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white border flex items-center justify-center shadow-sm"
            style={{ borderColor: style.borderColor }}
            aria-label="remove">
            <svg className="w-2.5 h-2.5" style={{ color: style.borderColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      );
    })
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start">
      {/* ── PDF pane ── */}
      <div ref={paneRef} className="flex-1 min-w-0 w-full">
        {/* Zoom toolbar */}
        <div className="flex items-center justify-end gap-1.5 mb-2">
          <button type="button" aria-label="Zoom out" disabled={zoom <= ZOOM_MIN}
            onClick={() => setZoom(z => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}
            className="w-7 h-7 rounded-[7px] border border-[#E5E7EB] text-[#374151] flex items-center justify-center disabled:opacity-40 hover:bg-[#F3F4F6] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M5 12h14" /></svg>
          </button>
          <span className="text-[12px] text-[#6B7280] tabular-nums w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Zoom in" disabled={zoom >= ZOOM_MAX}
            onClick={() => setZoom(z => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}
            className="w-7 h-7 rounded-[7px] border border-[#E5E7EB] text-[#374151] flex items-center justify-center disabled:opacity-40 hover:bg-[#F3F4F6] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M12 5v14M5 12h14" /></svg>
          </button>
        </div>
        <div className="relative max-h-[80vh] overflow-auto bg-[#F1F3F5] rounded-[10px] border border-[#E5E7EB] p-3 sm:p-4">
          {loading && !pdfFailed && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-[10px]">
              <div className="w-6 h-6 border-2 border-[#1a3c5e] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {pdfFailed ? (
            <div
              className="relative cursor-crosshair select-none rounded-[4px] shadow-sm w-full max-w-[520px] mx-auto"
              style={{ aspectRatio: "1 / 1.414", background: "white" }}
              onClick={handleClick}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-10">
                <svg className="w-16 h-16 text-[#1a3c5e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="absolute top-2 left-2 right-2 z-10">
                <div className="bg-amber-50 border border-amber-200 rounded-[7px] px-2.5 py-1.5 text-[11px] text-amber-700 text-center">
                  Vista previa no disponible — haz clic para colocar la firma
                </div>
              </div>
              {overlays}
            </div>
          ) : (
            <div
              className="relative shadow-sm rounded-[2px] mx-auto"
              style={disp ? { width: disp.w, height: disp.h } : { width: "100%", aspectRatio: "1 / 1.414" }}
            >
              <canvas
                ref={canvasRef}
                onClick={handleClick}
                className="block cursor-crosshair rounded-[2px] bg-white"
                style={disp ? { width: disp.w, height: disp.h } : { width: "100%", height: "100%" }}
              />
              {overlays}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-3">
            <button type="button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="px-3 py-1 text-[13px] rounded-[9px] border border-[#E5E7EB] text-[#374151] disabled:opacity-40 hover:bg-[#F3F4F6] transition-colors">←</button>
            <span className="text-[13px] text-[#6B7280]">{currentPage} / {totalPages}</span>
            <button type="button" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="px-3 py-1 text-[13px] rounded-[9px] border border-[#E5E7EB] text-[#374151] disabled:opacity-40 hover:bg-[#F3F4F6] transition-colors">→</button>
          </div>
        )}
      </div>

      {/* ── Controls pane ── */}
      <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-3 lg:sticky lg:top-[68px]">
        <div
          className="text-[13px] px-3 py-2.5 rounded-[9px] font-medium text-center"
          style={{ background: `${activeColor}15`, color: activeColor, border: `1px solid ${activeColor}30` }}
        >
          {positionActive(activeSigner + 1)}
        </div>

        {/* Signer tabs */}
        <div className="flex flex-wrap gap-2">
          {firmantes.map((f, i) => (
            <button key={i} type="button"
              onClick={() => onSelectSigner(i)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[9px] text-xs font-semibold transition-all border"
              style={{
                background: activeSigner === i ? SIGNER_COLORS[i % SIGNER_COLORS.length] : "white",
                color: activeSigner === i ? "white" : SIGNER_COLORS[i % SIGNER_COLORS.length],
                borderColor: SIGNER_COLORS[i % SIGNER_COLORS.length],
              }}
            >
              {i + 1}. {(f.nombre || signerFallback(i + 1)).slice(0, 14)}
              {f.posiciones.length > 0 && <span>· {f.posiciones.length}</span>}
            </button>
          ))}
          {firmantes.length < maxSigners && (
            <button type="button" onClick={onAddSigner}
              className="px-2.5 py-1.5 rounded-[9px] text-xs font-medium border border-dashed border-[#9CA3AF] text-[#6B7280] hover:border-[#1a3c5e] hover:text-[#1a3c5e] transition-colors">
              + {addSignerLabel}
            </button>
          )}
        </div>

        {/* Status list */}
        <div className="flex flex-col gap-1.5">
          {firmantes.map((f, i) => {
            const color = SIGNER_COLORS[i % SIGNER_COLORS.length];
            const isActive = i === activeSigner;
            return (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-[9px] text-[13px]"
                style={{ background: isActive ? `${color}12` : "#F9FAFB", border: `1px solid ${isActive ? color + "40" : "#E5E7EB"}` }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                  style={{ background: color }}>{i + 1}</span>
                <span className="font-medium text-[#374151] truncate flex-1">{f.nombre || signerFallback(i + 1)}</span>
                {f.posiciones.length > 0 ? (
                  <span className="text-[#10B981] text-[11px] font-medium shrink-0">✓ {fieldsCount(f.posiciones.length)}</span>
                ) : (
                  <span className="text-[#9CA3AF] text-[11px] shrink-0">{noFields}</span>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-[12px] text-[#9CA3AF] leading-relaxed">{positionHint}</p>
      </div>
    </div>
  );
}
