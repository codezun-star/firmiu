"use client";

import { useCallback, useEffect, useState } from "react";
import type { ToastType } from "@/lib/toast";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  leaving: boolean;
}

const CONFIG: Record<ToastType, { bg: string; border: string; iconPath: string }> = {
  success: {
    bg: "bg-[#065F46] border-[#10B981]/40",
    border: "border",
    iconPath: "M5 13l4 4L19 7",
  },
  error: {
    bg: "bg-[#7F1D1D] border-[#EF4444]/40",
    border: "border",
    iconPath: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  warning: {
    bg: "bg-[#78350F] border-[#F97316]/40",
    border: "border",
    iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  },
  info: {
    bg: "bg-[#1a3c5e] border-white/10",
    border: "border",
    iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
};

const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 3500,
  error:   5000,
  warning: 4500,
  info:    4000,
};

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        message: string;
        type: ToastType;
        duration?: number;
      };
      const type = detail.type ?? "info";
      const duration = detail.duration ?? DEFAULT_DURATION[type];
      const id = Date.now() + Math.random();

      setToasts((prev) => [...prev.slice(-3), { id, message: detail.message, type, leaving: false }]);
      setTimeout(() => dismiss(id), duration);
    };

    window.addEventListener("firmiu:toast", handler as EventListener);
    return () => window.removeEventListener("firmiu:toast", handler as EventListener);
  }, [dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-2 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
    >
      {toasts.map((t) => (
        <ToastBubble key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastBubble({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const cfg = CONFIG[item.type];

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const shown = visible && !item.leaving;

  return (
    <div
      role="alert"
      className={`
        ${cfg.bg} ${cfg.border} text-white rounded-xl px-4 py-3 shadow-2xl
        flex items-start gap-3 pointer-events-auto
        transition-all duration-300 ease-out
        ${shown ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}
      `}
    >
      {/* Icon */}
      <svg
        className="w-4 h-4 shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cfg.iconPath} />
      </svg>

      {/* Message */}
      <p className="text-[13px] font-medium leading-snug flex-1">{item.message}</p>

      {/* Dismiss */}
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5"
        aria-label="Cerrar"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
