"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("not_found");

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-[#1a3c5e]/5 bg-[#1a3c5e]/[0.02] pointer-events-none" />
      <div className="absolute top-40 -right-10 w-44 h-44 rounded-full border border-[#F97316]/8 bg-[#F97316]/[0.03] pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full border border-[#1a3c5e]/5 bg-[#1a3c5e]/[0.02] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-sm">
        <Link href="/" className="group">
          <p className="text-xl font-medium tracking-tight">
            <span className="text-[#1a3c5e] group-hover:text-[#15304d] transition-colors">firm</span>
            <span className="text-[#F97316]">iu</span>
          </p>
        </Link>
        <Link
          href="/"
          className="text-xs font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          {t("cta")} →
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          {/* 404 large number */}
          <div className="mb-6 select-none">
            <span className="text-[clamp(80px,15vw,128px)] font-bold leading-none tracking-tighter text-[#1a3c5e]">
              4
            </span>
            <span className="text-[clamp(80px,15vw,128px)] font-bold leading-none tracking-tighter text-[#F97316]">
              0
            </span>
            <span className="text-[clamp(80px,15vw,128px)] font-bold leading-none tracking-tighter text-[#1a3c5e]">
              4
            </span>
          </div>

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA]/60 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Text */}
          <h1 className="text-[22px] font-semibold text-[#111827] mb-3 leading-tight">
            {t("title")}
          </h1>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-8">
            {t("description")}
          </p>

          {/* CTA */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-medium px-6 py-2.5 rounded-[9px] transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t("cta")}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-5 text-center border-t border-[#E5E7EB]">
        <p className="text-xs text-[#9CA3AF]">
          © {new Date().getFullYear()}{" "}
          <span className="text-[#1a3c5e] font-medium">firm</span>
          <span className="text-[#F97316] font-medium">iu</span>
        </p>
      </footer>
    </div>
  );
}
