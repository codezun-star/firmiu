"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  pdfUrl: string;
  title: string;
  loadingLabel: string;
  errorLabel: string;
  openLabel: string;
}

/**
 * Read-only PDF preview that renders each page to a <canvas> with pdf.js.
 *
 * Why not an <iframe>: mobile browsers (Chrome on Android, Safari on iOS) do
 * NOT render PDFs embedded in an iframe/object — they show a blank area. Only
 * desktop browsers have a built-in inline viewer. Rendering to canvas works on
 * every device. If pdf.js fails (CORS, worker, etc.) we fall back to a button
 * that opens the PDF as a top-level navigation, which mobile DOES handle.
 *
 * The worker/polyfill setup mirrors PdfPosicionador.tsx — see CLAUDE.md
 * "⚠️ PDF preview" for why pdfjs-dist is pinned to 4.7.76 and the worker is
 * served as a blob: URL. Do not revert those.
 */
export default function PdfViewer({ pdfUrl, title, loadingLabel, errorLabel, openLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    // Safety timeout: if pdf.js hangs (e.g. a disconnected fake-worker promise
    // chain) flip to the fallback instead of spinning forever.
    const fallbackTimer = setTimeout(() => {
      if (!cancelled) { setLoading(false); setFailed(true); }
    }, 12000);

    (async () => {
      setLoading(true);
      setFailed(false);
      if (container) container.innerHTML = "";
      try {
        // Promise.try polyfill (ES2025) — pdfjs-dist v5 uses it internally. Must
        // forward args and turn sync throws into rejections (see PdfPosicionador).
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

        // Hand pdf.js the worker as a blob: URL with an explicit JS MIME type so
        // our global `X-Content-Type-Options: nosniff` header can't make the
        // browser reject the module worker. CSP allows `worker-src 'self' blob:`.
        let workerSrc = "/pdf.worker.min.mjs";
        try {
          const res = await fetch(workerSrc);
          if (res.ok) {
            const code = await res.text();
            workerSrc = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
          }
        } catch {
          // Keep the path fallback; pdf.js will attempt to load it directly.
        }
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

        const res = await fetch(pdfUrl);
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        const arrayBuffer = await res.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (cancelled) return;
        clearTimeout(fallbackTimer);

        const containerW = (container?.clientWidth ?? 0) || 600;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        for (let n = 1; n <= pdf.numPages; n++) {
          if (cancelled) return;
          const page = await pdf.getPage(n);
          const unscaled = page.getViewport({ scale: 1 });
          const cssScale = containerW / unscaled.width;
          const viewport = page.getViewport({ scale: cssScale * dpr });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";
          if (n > 1) canvas.style.marginTop = "8px";
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          if (cancelled) return;
          container?.appendChild(canvas);
          await page.render({ canvasContext: ctx, viewport }).promise;
          if (n === 1 && !cancelled) setLoading(false); // show first page ASAP
        }
        if (!cancelled) setLoading(false);
      } catch (err) {
        console.error("[PdfViewer] PDF preview failed:", err);
        if (!cancelled) {
          clearTimeout(fallbackTimer);
          setLoading(false);
          setFailed(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      if (container) container.innerHTML = "";
    };
  }, [pdfUrl]);

  if (failed) {
    return (
      <div className="h-44 flex flex-col items-center justify-center bg-[#FAFAFA] gap-3 px-4">
        <svg className="w-10 h-10 text-[#E5E7EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-xs text-[#9CA3AF]">{errorLabel}</p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3c5e] border border-[#E5E7EB] rounded-[9px] px-3 py-2 hover:bg-[#F3F4F6] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {openLabel}
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <div
          ref={containerRef}
          className="w-full max-h-[420px] min-h-[160px] overflow-y-auto bg-[#FAFAFA]"
          aria-label={title}
        />
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 gap-2">
            <div className="w-6 h-6 border-2 border-[#1a3c5e] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#9CA3AF]">{loadingLabel}</p>
          </div>
        )}
      </div>
      {/* Always-available escape hatch: open the PDF full-screen in a new tab. */}
      <div className="flex justify-center border-t border-[#F3F4F6] bg-white py-2">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1a3c5e] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {openLabel}
        </a>
      </div>
    </div>
  );
}
