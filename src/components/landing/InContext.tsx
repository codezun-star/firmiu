import Image from "next/image";
import { useTranslations } from "next-intl";

const stats = [
  { value: "+2,400", labelKey: "stat1" },
  { value: "98%", labelKey: "stat2" },
  { value: "< 3 min", labelKey: "stat3" },
];

export default function InContext() {
  const t = useTranslations("home.in_context");

  return (
    <section className="relative overflow-hidden">
      {/* Background photo with dark overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1400&auto=format&fit=crop&q=80"
          alt="Professionals collaborating on documents"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0f2640]/85" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-[#F97316] text-xs font-bold uppercase tracking-[0.15em] mb-4">
          {t("eyebrow")}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto leading-tight">
          {t("title")}
        </h2>
        <p className="text-[#94b8d4] text-base mb-12 max-w-xl mx-auto">
          {t("subtitle")}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          {stats.map((s) => (
            <div key={s.labelKey}>
              <p className="text-4xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-[#94b8d4] text-sm">{t(s.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
