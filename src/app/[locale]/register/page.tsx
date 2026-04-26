import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import AuthPageShell from "@/components/AuthPageShell";
import RegisterForm from "./RegisterForm";

interface RegisterPageProps {
  params: { locale: string };
  searchParams: { plan?: string };
}

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({ params: { locale } }: RegisterPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "auth.register" });
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";
  const prefix = locale === "es" ? "" : `/${locale}`;
  return {
    title: `${t("meta_title")} — Firmiu`,
    description: t("meta_description"),
    keywords: t("meta_keywords"),
    alternates: {
      canonical: `${base}${prefix}/register`,
      languages: { es: `${base}/register`, en: `${base}/en/register` },
    },
    openGraph: {
      title: `${t("meta_title")} — Firmiu`,
      description: t("meta_description"),
      url: `${base}${prefix}/register`,
      siteName: "Firmiu",
      locale: locale === "es" ? "es_419" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: `${t("meta_title")} — Firmiu`, description: t("meta_description") },
    robots: { index: true, follow: true },
  };
}

export default async function RegisterPage({ params: { locale }, searchParams }: RegisterPageProps) {
  setRequestLocale(locale);

  return (
    <AuthPageShell locale={locale}>
      <RegisterForm locale={locale} plan={searchParams.plan} />
    </AuthPageShell>
  );
}
