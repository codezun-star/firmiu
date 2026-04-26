"use client";

import { Link, usePathname } from "@/navigation";

interface AuthLanguageSwitcherProps {
  locale: string;
}

export default function AuthLanguageSwitcher({ locale }: AuthLanguageSwitcherProps) {
  const pathname = usePathname(); // path WITHOUT locale prefix (e.g. "/login")

  return (
    <div className="flex items-center gap-1">
      <Link
        href={pathname}
        locale="es"
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
          locale === "es"
            ? "bg-white/10 text-white"
            : "text-[#4d7a9e] hover:text-white"
        }`}
      >
        ES
      </Link>
      <Link
        href={pathname}
        locale="en"
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
          locale === "en"
            ? "bg-white/10 text-white"
            : "text-[#4d7a9e] hover:text-white"
        }`}
      >
        EN
      </Link>
    </div>
  );
}
