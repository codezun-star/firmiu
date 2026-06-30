"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";

/** Detailed feature × plan comparison. Values come from lib/plans.ts (shown as
 *  text) and the shared "included" feature labels in home.pricing. */
export default function PricingTable() {
  const t = useTranslations("pricing_page");
  const tp = useTranslations("home.pricing");

  type Cell = boolean | string;
  interface Row {
    label: string;
    values: [Cell, Cell, Cell, Cell]; // free, starter, pro, business
  }
  interface Group {
    title: string;
    rows: Row[];
  }

  const groups: Group[] = [
    {
      title: t("group_volume"),
      rows: [
        { label: t("row_price"), values: [`$${tp("free.price")}`, `$${tp("starter.price")}`, `$${tp("pro.price")}`, t("val_coming_soon")] },
        { label: t("row_docs"), values: ["3", "30", "100", t("val_unlimited")] },
        { label: t("row_pdfs"), values: ["1", "5", "10", "20"] },
        { label: t("row_signers"), values: ["5", "5", "5", "5"] },
      ],
    },
    {
      title: t("group_signing"),
      rows: [
        { label: tp("included_upload"), values: [true, true, true, true] },
        { label: tp("included_multifield"), values: [true, true, true, true] },
        { label: tp("included_order"), values: [true, true, true, true] },
        { label: tp("included_certificate"), values: [true, true, true, true] },
        { label: tp("included_legal"), values: [true, true, true, true] },
      ],
    },
    {
      title: t("group_audit"),
      rows: [
        { label: tp("included_ip"), values: [true, true, true, true] },
        { label: t("row_vpn"), values: [true, true, true, true] },
        { label: tp("included_datetime"), values: [true, true, true, true] },
        { label: tp("included_pdf"), values: [true, true, true, true] },
      ],
    },
    {
      title: t("group_productivity"),
      rows: [
        { label: tp("included_contacts"), values: [true, true, true, true] },
        { label: tp("reminder_feature"), values: [false, true, true, true] },
        { label: tp("included_bilingual"), values: [true, true, true, true] },
        { label: tp("included_noinstall"), values: [true, true, true, true] },
      ],
    },
    {
      title: t("group_support"),
      rows: [
        { label: t("row_support"), values: [t("support_email"), t("support_priority"), t("support_priority"), t("support_premium")] },
      ],
    },
  ];

  const cols = [
    { key: "free", name: tp("free.name") },
    { key: "starter", name: tp("starter.name") },
    { key: "pro", name: tp("pro.name"), popular: true },
    { key: "business", name: tp("business.name"), comingSoon: true },
  ] as const;

  const Check = () => (
    <svg className="w-4 h-4 mx-auto text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[680px] border-collapse text-left">
        <thead>
          <tr>
            <th className="w-[34%] py-4 px-3 align-bottom" />
            {cols.map((c) => (
              <th
                key={c.key}
                className={`py-4 px-3 text-center align-bottom ${
                  "popular" in c && c.popular ? "bg-[#1a3c5e] rounded-t-xl" : ""
                }`}
              >
                <span className={`block text-sm font-bold ${"popular" in c && c.popular ? "text-white" : "text-[#111827]"}`}>
                  {c.name}
                </span>
                {"popular" in c && c.popular && (
                  <span className="mt-1 inline-block text-[9px] font-bold uppercase tracking-wider text-[#F97316]">
                    {tp("popular")}
                  </span>
                )}
                {"comingSoon" in c && c.comingSoon && (
                  <span className="mt-1 inline-block text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                    {t("val_coming_soon")}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <Fragment key={g.title}>
              <tr>
                <td colSpan={5} className="pt-7 pb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  {g.title}
                </td>
              </tr>
              {g.rows.map((r) => (
                <tr key={r.label} className="border-t border-[#F3F4F6]">
                  <td className="py-3 px-3 text-[13px] text-[#374151]">{r.label}</td>
                  {r.values.map((v, i) => (
                    <td
                      key={i}
                      className={`py-3 px-3 text-center text-[13px] ${
                        cols[i].key === "pro" ? "bg-[#1a3c5e]/[0.03]" : ""
                      }`}
                    >
                      {typeof v === "boolean" ? (
                        v ? <Check /> : <span className="text-[#D1D5DB]">—</span>
                      ) : (
                        <span className="font-medium text-[#111827]">{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
