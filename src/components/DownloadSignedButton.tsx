"use client";

import { useState } from "react";
import { downloadSignedPdfAction } from "@/app/actions/sign";

interface Props {
  token: string;
  ctaLabel: string;
  hintLabel?: string;
  expiredLabel: string;
}

export default function DownloadSignedButton({ token, ctaLabel, hintLabel, expiredLabel }: Props) {
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const { url } = await downloadSignedPdfAction(token);
      if (url) {
        const a = document.createElement("a");
        a.href = url;
        a.download = "documento-firmado.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        setExpired(true);
      }
    } catch {
      setExpired(true);
    }
    setLoading(false);
  }

  if (expired) {
    return (
      <p className="text-xs text-red-500 text-center">{expiredLabel}</p>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-[9px] text-sm transition-colors"
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )}
        {loading ? "Descargando..." : ctaLabel}
      </button>
      {hintLabel && !loading && (
        <p className="text-xs text-[#9CA3AF] mt-2">{hintLabel}</p>
      )}
    </div>
  );
}
