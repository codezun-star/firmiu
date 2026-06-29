import Link from "next/link";

/** Firmiu mark — a quill/feather in a navy→orange badge with a white feather.
 *  Works on any background (the badge provides its own contrast). */
export function FirmiuMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="url(#firmiu-mark-g)" />
      <g transform="translate(4 4)" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <path d="M16 8 2 22" />
        <path d="M17.5 15H9" />
      </g>
      <defs>
        <linearGradient id="firmiu-mark-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a3c5e" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface LogoProps {
  locale: string;
  className?: string;
  white?: boolean;
}

export default function Logo({ locale, className = "", white = false }: LogoProps) {
  return (
    <Link
      href={`/${locale === "es" ? "" : locale}`}
      className={`flex items-center gap-2 ${className}`}
      aria-label="Firmiu"
    >
      <FirmiuMark className="w-8 h-8 shrink-0" />
      <span className="text-xl font-semibold tracking-tight">
        <span className={white ? "text-white" : "text-[#1a3c5e]"}>firm</span>
        <span className="text-[#F97316]">iu</span>
      </span>
    </Link>
  );
}
