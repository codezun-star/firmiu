"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { logoutAction } from "@/app/actions/auth";

interface DashboardNavProps {
  locale: string;
  userName: string;
  userInitials: string;
  currentPlan: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function NavIcon({ path }: { path: string }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={path} />
    </svg>
  );
}

const PLAN_KEY_MAP: Record<string, "plan_free" | "plan_starter" | "plan_pro" | "plan_business"> = {
  free:     "plan_free",
  starter:  "plan_starter",
  pro:      "plan_pro",
  business: "plan_business",
};

export default function DashboardNav({ locale, userName, userInitials, currentPlan }: DashboardNavProps) {
  const t = useTranslations("nav");
  const td = useTranslations("dashboard");
  const tdoc = useTranslations("documents");
  const tn = useTranslations("nuevo");
  const tc = useTranslations("contacts_page");
  const ts = useTranslations("settings");
  const pathname = usePathname();
  const prefix = locale === "es" ? "" : `/${locale}`;
  const [open, setOpen] = useState(false);

  const links: NavItem[] = [
    {
      href: `${prefix}/dashboard`,
      label: t("dashboard"),
      icon: <NavIcon path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    },
    {
      href: `${prefix}/dashboard/documentos`,
      label: t("documents"),
      icon: <NavIcon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    },
    {
      href: `${prefix}/dashboard/firmas`,
      label: t("signatures"),
      icon: <NavIcon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />,
    },
    {
      href: `${prefix}/dashboard/contactos`,
      label: t("contacts"),
      icon: <NavIcon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    },
    {
      href: `${prefix}/dashboard/cuenta`,
      label: t("settings"),
      icon: <NavIcon path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
    },
  ];

  function isActive(href: string) {
    if (href === `${prefix}/dashboard`) return pathname === href;
    return pathname.startsWith(href);
  }

  function getPageTitle() {
    if (pathname.includes("/contactos")) return tc("title");
    if (pathname.includes("/documentos")) return tdoc("title");
    if (pathname.includes("/nuevo")) return tn("title");
    if (pathname.includes("/cuenta")) return ts("title");
    if (pathname.includes("/firmas")) return t("signatures");
    return td("title");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <p className="text-lg font-medium tracking-tight">
          <span className="text-white">firm</span>
          <span className="text-[#F97316]">iu</span>
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-[10px] uppercase tracking-widest text-[#4d7a9e] px-2 mb-2 font-medium">
          {t("main_section")}
        </p>
        <div className="space-y-0.5">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-2 py-2 rounded-lg text-[13px] font-medium transition-colors border-r-2 ${
                  active
                    ? "text-white bg-white/[0.08] border-[#F97316]"
                    : "text-[#94b8d4] hover:text-white hover:bg-white/[0.05] border-transparent"
                }`}
              >
                <span className={active ? "text-[#F97316]" : "text-[#6a9abf]"}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 px-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-[#F97316] flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-bold">{userInitials || "U"}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-[12px] font-medium truncate leading-tight">
              {userName || "Usuario"}
            </p>
            <p className="text-[#4d7a9e] text-[10px] leading-tight">{t(PLAN_KEY_MAP[currentPlan] ?? "plan_free")}</p>
          </div>
        </div>
        <form action={logoutAction}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="flex items-center gap-2.5 px-2 py-1.5 w-full rounded-lg text-[12px] font-medium text-[#94b8d4] hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t("logout")}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-[200px] bg-[#1a3c5e] flex flex-col transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Mobile close button */}
        <button
          className="absolute top-4 right-4 text-[#94b8d4] hover:text-white md:hidden"
          onClick={() => setOpen(false)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <SidebarContent />
      </aside>

      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 md:left-[200px] h-[52px] bg-white border-b border-[#E5E7EB] z-10 flex items-center justify-between px-4 md:px-6">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-[#6B7280] hover:text-[#111827] transition-colors"
            onClick={() => setOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-[15px] font-medium text-[#111827]">{getPageTitle()}</span>
        </div>

        {/* Right: new document button */}
        <Link
          href={`${prefix}/dashboard/nuevo`}
          className="inline-flex items-center gap-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-medium px-3 py-1.5 rounded-[9px] transition-colors duration-150"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">{td("new_document")}</span>
          <span className="sm:hidden">+</span>
        </Link>
      </header>
    </>
  );
}
