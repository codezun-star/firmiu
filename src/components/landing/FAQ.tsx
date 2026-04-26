import { useTranslations } from "next-intl";

export default function FAQ() {
  const t = useTranslations("home.faq");

  const pairs = Array.from({ length: 8 }, (_, i) => ({
    q: t(`q${i + 1}` as Parameters<typeof t>[0]),
    a: t(`a${i + 1}` as Parameters<typeof t>[0]),
  }));

  return (
    <section className="bg-[#F8F9FA] py-16 px-4" id="faq">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">{t("title")}</h2>
          <p className="text-[#6B7280] text-sm">{t("subtitle")}</p>
        </div>

        <dl className="space-y-3">
          {pairs.map((pair, i) => (
            <details
              key={i}
              className="group bg-white rounded-[14px] border border-[#E5E7EB] overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none">
                <dt className="text-[14px] font-semibold text-[#111827]">{pair.q}</dt>
                <span className="shrink-0 w-5 h-5 rounded-full bg-[#F0F7FF] flex items-center justify-center text-[#1a3c5e] transition-transform duration-200 group-open:rotate-45">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </summary>
              <dd className="px-5 pb-4 text-[14px] text-[#4B5563] leading-relaxed border-t border-[#F3F4F6] pt-3">
                {pair.a}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
