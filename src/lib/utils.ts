export function getPrefix(locale: string): string {
  return locale === "es" ? "" : `/${locale}`;
}
