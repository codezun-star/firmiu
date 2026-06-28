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

const SIGNER_COLORS = ["#1a3c5e", "#F97316", "#10B981", "#8B5CF6", "#EF4444"];
// Signature-sized field (relative to page). Kept small so the signature sits
// naturally on a signature line instead of a huge floating box. The stamped
// signature (drawSignatureOnPage) scales to whatever field is stored, so these
// two values define the on-document size — keep them modest.
const FIELD_W = 0.20;
const FIELD_H = 0.05;

interface Props {
  file: File;
  firmantes: FirmanteLocal[];
  activeSigner: number;
  onPlace: (signerIndex: number, pos: PosicionFirma) => void;
  // Signer controls (rendered beside the preview)
  onSelectSigner: (i: number) => void;
  onAddSigner: () => void;
  maxSigners: number;
  signerFallback: (n: number) => string;
  addSignerLabel: string;
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
  onSelectSigner,
  onAddSigner,
  maxSigners,
  signerFallback,
  addSignerLabel,
  positionHint,
  positionActive,
  positionPlaced,
  positionNotPlaced,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pdfFailed, setPdfFailed] = useState(false);
  // Display size of the page (CSS px). Internal canvas resolution is this × DPR
  // for a crisp render on high-DPI screens (fixes the blurry preview).
  const [disp, setDisp] = useState<{ w: number; h: number } | null>(null);
  const pdfRef = useRef<{ getPage: (n: number) => Promise<unknown> } | null>(null);

  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfRef.current || !canvasRef.current) return;
    setLoading(true);
    try {
      const page = await pdfRef.current.getPage(pageNum) as {
        getViewport: (o: { scale: number }) => { width: number; height: number };
        render: (o: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => { promise: Promise<void> };
      };
      const pane = paneRef.current;
      const paneW = (pane?.clientWidth ?? 0) || 640;
      const unscaled = page.getViewport({ scale: 1 });
      const aspect = unscaled.height / unscaled.width;

      // Fit the whole page within the pane width AND ~80% of the viewport height
      // so the document is fully visible (intuitive positioning, no scrolling).
      const maxH = Math.max(380, Math.round((typeof window !== "undefined" ? window.innerHeight : 900) * 0.8));
      let displayW = paneW;
      let displayH = displayW * aspect;
      if (displayH > maxH) { displayH = maxH; displayW = displayH / aspect; }

      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2.5);
      const viewport = page.getViewport({ scale: (displayW / unscaled.width) * dpr });
      const canvas = canvasRef.current;
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      setDisp({ w: Math.round(displayW), h: Math.round(displayH) });
      await page.render({ canvasContext: ctx, viewport }).promise;
    } catch (err) {
      console.error("[PdfPosicionador] page render failed:", err);
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
        // Promise.try polyfill (pdfjs-dist v5). Must forward args + convert sync
        // throws to rejections; dropping the args broke pdf.js ("docId").
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

        // Worker as a blob: URL with explicit JS MIME — sidesteps the global
        // `X-Content-Type-Options: nosniff` header rejecting the module worker.
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

  // Re-render on container resize (window resize / layout changes) so the
  // preview stays crisp and correctly sized.
  useEffect(() => {
    const pane = paneRef.current;
    if (!pane || typeof ResizeObserver === "undefined") return;
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (pdfRef.current && !pdfFailed) renderPage(currentPage);
      });
    });
    ro.observe(pane);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [renderPage, currentPage, pdfFailed]);

  function placeFromPoint(clientX: number, clientY: number, rect: DOMRect) {
    const w = rect.width;
    const h = rect.height;
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;
    const fw = FIELD_W * w;
    const fh = FIELD_H * h;
    const campo_x = Math.max(0, Math.min(1 - FIELD_W, (clickX - fw / 2) / w));
    const campo_y = Math.max(0, Math.min(1 - FIELD_H, (clickY - fh / 2) / h));
    onPlace(activeSigner, { pagina: currentPage, campo_x, campo_y, campo_ancho: FIELD_W, campo_alto: FIELD_H });
  }

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    placeFromPoint(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
  }

  function fieldStyle(pos: PosicionFirma, index: number) {
    if (pos.pagina !== currentPage) return null;
    const color = SIGNER_COLORS[index % SIGNER_COLORS.length];
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

  const overlays = firmantes.map((f, i) => {
    if (!f.posicion) return null;
    const style = fieldStyle(f.posicion, i);
    if (!style) return null;
    return (
      <div key={i} className="absolute border-2 rounded-[4px] flex items-center justify-center pointer-events-none"
        style={{ ...style, background: `${style.borderColor}18` }}>
        <span className="text-[11px] font-bold px-1" style={{ color: style.color }}>{i + 1}</span>
      </div>
    );
  });

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start">
      {/* ── PDF pane (large) ── */}
      <div ref={paneRef} className="flex-1 min-w-0 w-full">
        <div className="relative flex justify-center bg-[#F1F3F5] rounded-[10px] border border-[#E5E7EB] p-3 sm:p-4">
          {loading && !pdfFailed && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-[10px]">
              <div className="w-6 h-6 border-2 border-[#1a3c5e] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {pdfFailed ? (
            <div
              className="relative cursor-crosshair select-none rounded-[4px] shadow-sm w-full max-w-[520px]"
              style={{ aspectRatio: "1 / 1.414", background: "white" }}
              onClick={handleClick}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-10">
                <svg className="w-16 h-16 text-[#1a3c5e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-[#1a3c5e] text-xs font-medium mt-2">Página {currentPage}</p>
              </div>
              <div className="absolute top-2 left-2 right-2 z-10">
                <div className="bg-amber-50 border border-amber-200 rounded-[7px] px-2.5 py-1.5 text-[11px] text-amber-700 text-center">
                  Vista previa no disponible — haz clic para posicionar la firma
                </div>
              </div>
              {overlays}
            </div>
          ) : (
            <div
              className="relative shadow-sm rounded-[2px]"
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

        {/* Navegación de páginas */}
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
        {/* Active hint */}
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
              {f.posicion && <span>✓</span>}
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
                {f.posicion ? (
                  <span className="text-[#10B981] text-[11px] font-medium shrink-0">✓ {positionPlaced(f.posicion.pagina)}</span>
                ) : (
                  <span className="text-[#9CA3AF] text-[11px] shrink-0">{positionNotPlaced}</span>
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
