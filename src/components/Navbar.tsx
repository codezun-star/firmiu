"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const isEnglish = pathname.startsWith("/en");
  const prefix = isEnglish ? "/en" : "";
  const [open, setOpen] = useState(false);

  const switchLanguage = (targetLocale: string) => {
    if (targetLocale === "es") {
      const newPath = pathname.startsWith("/en") ? pathname.slice(3) || "/" : pathname;
      router.push(newPath);
    } else {
      const newPath = pathname.startsWith("/en") ? pathname : "/en" + pathname;
      router.push(newPath);
    }
  };

  const LangToggle = ({ mobile }: { mobile?: boolean }) => (
    <div className={`flex items-center gap-1 ${mobile ? "text-sm" : "text-xs"}`}>
      <button
        onClick={() => switchLanguage("es")}
        className={`px-2 py-0.5 rounded transition-colors font-medium ${
          !isEnglish ? "text-[#F97316]" : "text-[#94b8d4] hover:text-white"
        }`}
      >
        ES
      </button>
      <span className="text-[#2d5a80]">|</span>
      <button
        onClick={() => switchLanguage("en")}
        className={`px-2 py-0.5 rounded transition-colors font-medium ${
          isEnglish ? "text-[#F97316]" : "text-[#94b8d4] hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#1a3c5e] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`${prefix}/`} className="text-xl font-medium tracking-tight shrink-0">
            <span className="text-white">firm</span>
            <span className="text-[#F97316]">iu</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#como-funciona"
              className="text-sm text-[#94b8d4] hover:text-white transition-colors"
            >
              {t("features")}
            </a>
            <a
              href="#precios"
              className="text-sm text-[#94b8d4] hover:text-white transition-colors"
            >
              {t("pricing")}
            </a>
            <Link
              href={`${prefix}/nosotros`}
              className="text-sm text-[#94b8d4] hover:text-white transition-colors"
            >
              {t("nosotros")}
            </Link>
            <Link
              href={`${prefix}/contacto`}
              className="text-sm text-[#94b8d4] hover:text-white transition-colors"
            >
              {t("contacto")}
            </Link>
          </nav>

          {/* Desktop: language toggle + CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <LangToggle />
            <div className="w-px h-4 bg-white/20" />
            <Link
              href={`${prefix}/login`}
              className="text-sm font-medium text-[#94b8d4] hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              {t("login")}
            </Link>
            <Link
              href={`${prefix}/register`}
              className="text-sm font-medium text-white bg-[#F97316] hover:bg-[#EA580C] px-4 py-2 rounded-[9px] transition-colors"
            >
              {t("register")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#94b8d4] hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-white/10 py-3 space-y-0.5 pb-4">
            <a
              href="#como-funciona"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm text-[#94b8d4] hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
            >
              {t("features")}
            </a>
            <a
              href="#precios"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm text-[#94b8d4] hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
            >
              {t("pricing")}
            </a>
            <Link
              href={`${prefix}/nosotros`}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm text-[#94b8d4] hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
            >
              {t("nosotros")}
            </Link>
            <Link
              href={`${prefix}/contacto`}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm text-[#94b8d4] hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
            >
              {t("contacto")}
            </Link>
            <div className="pt-3 mt-2 border-t border-white/10 space-y-2">
              {/* Language toggle in mobile */}
              <div className="px-3 py-1">
                <LangToggle mobile />
              </div>
              <Link
                href={`${prefix}/login`}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm text-[#94b8d4] hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
              >
                {t("login")}
              </Link>
              <Link
                href={`${prefix}/register`}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-white bg-[#F97316] hover:bg-[#EA580C] rounded-[9px] transition-colors text-center"
              >
                {t("register")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
