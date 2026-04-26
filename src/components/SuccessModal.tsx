"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
  title: string;
  subtitle: string;
  redirectTo: string;
  delayMs?: number;
}

export default function SuccessModal({
  title,
  subtitle,
  redirectTo,
  delayMs = 3200,
}: SuccessModalProps) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push(redirectTo), delayMs);
    return () => clearTimeout(t);
  }, [router, redirectTo, delayMs]);

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center px-4"
      style={{ animation: "firmiu-overlay-in 280ms ease forwards" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[3px]" />

      {/* Card */}
      <div
        className="relative bg-white rounded-[22px] shadow-2xl px-8 pt-10 pb-0 max-w-[340px] w-full text-center overflow-hidden"
        style={{ animation: "firmiu-modal-in 450ms cubic-bezier(0.34, 1.42, 0.64, 1) forwards" }}
      >
        {/* Animated check icon */}
        <div className="flex justify-center mb-5">
          <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
            {/* Soft green bg */}
            <circle cx="44" cy="44" r="40" fill="#ECFDF5" />
            {/* Outer pulse ring */}
            <circle cx="44" cy="44" r="40" fill="none" stroke="#D1FAE5" strokeWidth="1.5" />
            {/* Animated border circle — starts at top (rotated -90deg via SVG transform) */}
            <g transform="rotate(-90 44 44)">
              <circle
                cx="44"
                cy="44"
                r="32"
                stroke="#10B981"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="201"
                strokeDashoffset="201"
                style={{ animation: "firmiu-circle-draw 650ms ease 80ms forwards" }}
              />
            </g>
            {/* Animated checkmark */}
            <path
              d="M28 44L38 56L60 30"
              stroke="#10B981"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="49"
              strokeDashoffset="49"
              style={{ animation: "firmiu-check-draw 380ms ease 620ms forwards" }}
            />
          </svg>
        </div>

        {/* Text */}
        <div style={{ animation: "firmiu-text-in 400ms ease 750ms both" }}>
          <h2 className="text-[19px] font-bold text-[#111827] mb-2 leading-tight">{title}</h2>
          <p className="text-[13px] text-[#6B7280] leading-relaxed mb-8 px-1">{subtitle}</p>
        </div>

        {/* Countdown progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#F3F4F6]">
          <div
            className="h-full bg-[#10B981] origin-left"
            style={{ animation: `firmiu-countdown ${delayMs}ms linear forwards` }}
          />
        </div>
      </div>
    </div>
  );
}
