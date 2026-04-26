import { useTranslations } from "next-intl";

const featureIcons = [
  // Legal
  <svg key="legal" className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
  // Cloud
  <svg key="cloud" className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>,
  // Audit trail
  <svg key="audit" className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>,
  // Email send
  <svg key="email" className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>,
  // Lock/secure
  <svg key="lock" className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>,
  // Easy/star
  <svg key="easy" className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
];

export default function Features() {
  const t = useTranslations("home.features_section");

  const features = [
    { title: t("f1_title"), desc: t("f1_desc") },
    { title: t("f2_title"), desc: t("f2_desc") },
    { title: t("f3_title"), desc: t("f3_desc") },
    { title: t("f4_title"), desc: t("f4_desc") },
    { title: t("f5_title"), desc: t("f5_desc") },
    { title: t("f6_title"), desc: t("f6_desc") },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-3">
            {t("title")}
          </h2>
          <p className="text-[#6B7280] text-base max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-[#FAFAFA] hover:bg-white border-[0.5px] border-[#E5E7EB] hover:border-[#F97316]/30 rounded-2xl p-6 transition-all hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-[#FED7AA]/60 flex items-center justify-center mb-4 group-hover:bg-[#F97316]/10 transition-colors">
                {featureIcons[i]}
              </div>
              <h3 className="text-[14px] font-semibold text-[#111827] mb-1.5 leading-snug">
                {f.title}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
