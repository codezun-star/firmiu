import { useTranslations } from "next-intl";

const stepIcons = [
  // Upload
  <svg key="upload" className="w-6 h-6 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>,
  // Email/link
  <svg key="email" className="w-6 h-6 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>,
  // Download/done
  <svg key="done" className="w-6 h-6 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
];

export default function HowItWorks() {
  const t = useTranslations("home.how_it_works");

  const steps = [
    { num: t("step1_num"), title: t("step1_title"), desc: t("step1_desc") },
    { num: t("step2_num"), title: t("step2_title"), desc: t("step2_desc") },
    { num: t("step3_num"), title: t("step3_title"), desc: t("step3_desc") },
  ];

  return (
    <section id="como" className="py-20 bg-[#F8F9FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-3">
            {t("title")}
          </h2>
          <p className="text-[#6B7280] text-base max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.66%+16px)] right-[calc(16.66%+16px)] h-px bg-gradient-to-r from-[#F97316]/30 via-[#F97316]/60 to-[#F97316]/30" />

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              {/* Number + icon circle */}
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-2xl bg-white border-[0.5px] border-[#E5E7EB] shadow-sm flex items-center justify-center relative z-10">
                  {stepIcons[i]}
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#F97316] text-white text-[10px] font-bold flex items-center justify-center z-20">
                  {i + 1}
                </span>
              </div>

              <p className="text-[10px] font-bold text-[#F97316] tracking-[0.12em] uppercase mb-2">
                {step.num}
              </p>
              <h3 className="text-[15px] font-semibold text-[#111827] mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
