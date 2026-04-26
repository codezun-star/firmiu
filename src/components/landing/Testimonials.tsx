import Image from "next/image";
import { useTranslations } from "next-intl";

function QuoteIcon() {
  return (
    <svg className="w-8 h-8 text-[#F97316]/25" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

const avatarPhotos = [
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=80&auto=format&fit=crop&q=80",
];

export default function Testimonials() {
  const t = useTranslations("home.testimonials");

  const testimonials = [
    { name: t("t1_name"), role: t("t1_role"), text: t("t1_text") },
    { name: t("t2_name"), role: t("t2_role"), text: t("t2_text") },
    { name: t("t3_name"), role: t("t3_role"), text: t("t3_text") },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827]">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="bg-[#FAFAFA] border-[0.5px] border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} className="w-4 h-4 text-[#F97316]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <QuoteIcon />

              <p className="text-[#374151] text-sm leading-relaxed flex-1">
                &ldquo;{item.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-[#F3F4F6]">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-[#E5E7EB]">
                  <Image
                    src={avatarPhotos[i]}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#111827] truncate">{item.name}</p>
                  <p className="text-[11px] text-[#9CA3AF] truncate">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
