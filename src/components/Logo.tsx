import Link from "next/link";

interface LogoProps {
  locale: string;
  className?: string;
  white?: boolean;
}

export default function Logo({ locale, className = "", white = false }: LogoProps) {
  return (
    <Link
      href={`/${locale === "es" ? "" : locale}`}
      className={`flex items-center gap-1.5 ${className}`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={white ? "text-[#F97316]" : "text-primary-600"}
        aria-hidden="true"
      >
        <path
          d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`text-xl font-bold tracking-tight ${white ? "text-white" : "text-gray-900"}`}>
        firmiu
      </span>
    </Link>
  );
}
