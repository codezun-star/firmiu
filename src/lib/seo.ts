/**
 * Centralized SEO helpers for international (Spanish-first) targeting.
 *
 * Firmiu targets every Spanish-speaking market — all of Latin America, Spain
 * and the US Hispanic audience — plus an English version. Google lets many
 * `hreflang` regional codes point to the same canonical URL, which makes a
 * single Spanish page eligible to rank in each country's localized results.
 */

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";

/**
 * Spanish-speaking regions we want to be eligible for in regional SERPs.
 * All of them resolve to the same canonical Spanish URL.
 */
export const ES_REGIONS = [
  "es-MX", "es-CO", "es-AR", "es-CL", "es-PE", "es-CR", "es-GT", "es-EC",
  "es-HN", "es-SV", "es-BO", "es-PY", "es-UY", "es-PA", "es-DO", "es-NI",
  "es-VE", "es-ES", "es-US",
] as const;

/**
 * Build the hreflang `languages` map for a canonical sub-path.
 * @param path Path without locale prefix, e.g. "" (home) or "/nosotros".
 */
export function buildLanguages(path: string): Record<string, string> {
  const esUrl = `${APP_URL}${path}`;
  const enUrl = `${APP_URL}/en${path}`;

  const languages: Record<string, string> = { es: esUrl };
  for (const region of ES_REGIONS) languages[region] = esUrl;
  languages["en"] = enUrl;
  languages["en-US"] = enUrl;
  languages["x-default"] = esUrl;

  return languages;
}

/**
 * Full `alternates` block (canonical + hreflang) for a page in a given locale.
 * @param locale Active locale ("es" | "en").
 * @param path   Canonical path without locale prefix, e.g. "/nosotros".
 */
export function buildAlternates(locale: string, path: string) {
  const prefix = locale === "es" ? "" : `/${locale}`;
  return {
    canonical: `${APP_URL}${prefix}${path}`,
    languages: buildLanguages(path),
  };
}

/**
 * Open Graph locale + alternate locales. We advertise Spain, LATAM, US and EN
 * variants so social previews are served correctly across markets.
 */
export function buildOgLocale(
  locale: string
): { locale: string; alternateLocale: string[] } {
  if (locale === "es") {
    return {
      locale: "es_ES",
      alternateLocale: ["es_MX", "es_AR", "es_CO", "es_CL", "es_US", "en_US"],
    };
  }
  return {
    locale: "en_US",
    alternateLocale: ["es_ES", "es_MX", "es_US"],
  };
}
