export function getPrefix(locale: string): string {
  return locale === "es" ? "" : `/${locale}`;
}

/**
 * Turn a document title into a safe download filename (without extension).
 * Strips characters illegal in filenames and control chars, collapses spaces.
 */
export function safeFilename(name: string): string {
  const cleaned = (name || "")
    .replace(/[/\\:*?"<>|\x00-\x1F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120)
    .trim();
  return cleaned || "documento";
}
