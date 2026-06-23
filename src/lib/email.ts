/**
 * Shared building blocks for transactional email HTML.
 *
 * These were inlined and duplicated across every Resend call in
 * actions/documents.ts and actions/sign.ts. Centralizing the shell, the code
 * box and the CTA button keeps the look consistent and the markup in one place.
 *
 * Note: callers must escape any user-provided values (e.g. with escapeHtml)
 * before interpolating them into the `inner` HTML.
 */

const BRAND_NAVY = "#1a3c5e";
const BRAND_ORANGE = "#f97316";

/** Wrap inner HTML in the standard Firmiu email card (navy header + border). */
export function emailShell(inner: string): string {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:0;background:#ffffff">
      <div style="background:${BRAND_NAVY};padding:24px 32px;border-radius:12px 12px 0 0">
        <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px">firmiu</span>
      </div>
      <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
        ${inner}
      </div>
    </div>
  `;
}

/** Highlighted 4-digit verification code box. */
export function codeBox(code: string): string {
  return `
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:20px;text-align:center;margin:0 0 24px">
      <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:${BRAND_ORANGE}">${code}</span>
    </div>
  `;
}

/** Primary call-to-action button. Defaults to the orange action color. */
export function ctaButton(href: string, label: string, bg: string = BRAND_ORANGE): string {
  return `
    <a href="${href}" style="background:${bg};color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;font-size:15px;margin:0 0 24px">
      ${label}
    </a>
  `;
}

/** Navy-colored CTA, used in owner notifications ("go to dashboard"). */
export function ctaButtonNavy(href: string, label: string): string {
  return ctaButton(href, label, BRAND_NAVY);
}
