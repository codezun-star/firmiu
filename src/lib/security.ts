/**
 * Shared security utilities — server-side only.
 * Never import this from a Client Component.
 */

// ── Input sanitization ──────────────────────────────────────────────────────

/** Remove ASCII control characters (except \t \n \r) and truncate to maxLength. */
export function sanitizeText(input: string, maxLength = 255): string {
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .slice(0, maxLength)
    .trim();
}

/** Escape HTML special characters to prevent injection in email HTML bodies. */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ── Validation ──────────────────────────────────────────────────────────────

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email: string): boolean {
  return email.length <= 320 && EMAIL_RE.test(email);
}

/** Password must be 8–128 chars. */
export function isValidPassword(password: string): boolean {
  return password.length >= 8 && password.length <= 128;
}

/** UUID v4 format check (prevents token injection). */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUUID(value: string): boolean {
  return UUID_RE.test(value);
}

/** Allow only safe internal redirect paths (no protocol, no double-slash). */
export function sanitizeRedirectPath(next: string | null): string {
  if (!next) return "/dashboard";
  if (
    !next.startsWith("/") ||
    next.startsWith("//") ||
    /^\/[^/]*:/.test(next) // catches paths like /javascript: or /data:
  ) {
    return "/dashboard";
  }
  // Block protocol-relative and external URLs that sneak through
  try {
    const url = new URL(next, "https://firmiu.com");
    if (url.host !== "firmiu.com") return "/dashboard";
    return url.pathname + url.search;
  } catch {
    return "/dashboard";
  }
}

// ── 4-digit verification code ───────────────────────────────────────────────

/** Only accept exactly 4 numeric digits. */
export function isValidVerificationCode(code: string): boolean {
  return /^\d{4}$/.test(code);
}
