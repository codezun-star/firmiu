"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const prefix = locale === "en" ? "/en" : "";

  return (
    <footer className="bg-[#0f2640]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">

        {/* Top grid — 3 columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-xl font-medium tracking-tight mb-3">
              <span className="text-white">firm</span>
              <span className="text-[#F97316]">iu</span>
            </p>
            <p className="text-[#6a9abf] text-[13px] leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-white text-[11px] font-semibold uppercase tracking-widest mb-4">
              {t("product_title")}
            </p>
            <ul className="space-y-2.5">
              <li>
                <a href={`${prefix}/#como`} className="text-[#6a9abf] hover:text-white text-sm transition-colors">
                  {t("feat_link")}
                </a>
              </li>
              <li>
                <a href={`${prefix}/#planes`} className="text-[#6a9abf] hover:text-white text-sm transition-colors">
                  {t("pricing_link")}
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-white text-[11px] font-semibold uppercase tracking-widest mb-4">
              {t("company_title")}
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link href={`${prefix}/nosotros`} className="text-[#6a9abf] hover:text-white text-sm transition-colors">
                  {t("about_link")}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/contacto`} className="text-[#6a9abf] hover:text-white text-sm transition-colors">
                  {t("contact_link")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#4d7a9e] text-xs">
            &copy; {new Date().getFullYear()} Firmiu. {t("rights")}
          </p>

          <div className="flex items-center gap-5">
            <Link
              href={`${prefix}/privacidad`}
              className="text-[#4d7a9e] hover:text-white text-xs transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href={`${prefix}/terminos`}
              className="text-[#4d7a9e] hover:text-white text-xs transition-colors"
            >
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
