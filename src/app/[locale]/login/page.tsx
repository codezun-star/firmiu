import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import AuthPageShell from "@/components/AuthPageShell";
import LoginForm from "./LoginForm";

interface LoginPageProps {
  params: { locale: string };
  searchParams: { error?: string };
}

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({ params: { locale } }: LoginPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "auth.login" });
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";
  const prefix = locale === "es" ? "" : `/${locale}`;
  return {
    title: `${t("meta_title")} — Firmiu`,
    description: t("meta_description"),
    keywords: t("meta_keywords"),
    alternates: {
      canonical: `${base}${prefix}/login`,
      languages: { es: `${base}/login`, en: `${base}/en/login` },
    },
    openGraph: {
      title: `${t("meta_title")} — Firmiu`,
      description: t("meta_description"),
      url: `${base}${prefix}/login`,
      siteName: "Firmiu",
      locale: locale === "es" ? "es_419" : "en_US",
      type: "website",
    },
    twitter: { card: "summary", title: `${t("meta_title")} — Firmiu`, description: t("meta_description") },
    robots: { index: true, follow: true },
  };
}

export default async function LoginPage({
  params: { locale },
  searchParams,
}: LoginPageProps) {
  setRequestLocale(locale);
  const oauthError = searchParams.error ?? null;

  return (
    <AuthPageShell locale={locale}>
      <LoginForm locale={locale} oauthError={oauthError} />
    </AuthPageShell>
  );
}
