import type { Metadata } from "next";
import { buildAlternates, buildOgLocale } from "@/lib/seo";
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
  const title = `${t("meta_title")} — Firmiu`;
  const description = t("meta_description");
  const ogImage = `${base}/api/og?title=${encodeURIComponent(t("meta_title"))}`;
  return {
    title,
    description,
    keywords: t("meta_keywords"),
    alternates: buildAlternates(locale, "/register"),
    openGraph: {
      title,
      description,
      url: `${base}${prefix}/register`,
      siteName: "Firmiu",
      ...buildOgLocale(locale),
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
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
