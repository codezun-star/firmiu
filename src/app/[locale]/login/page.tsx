import { setRequestLocale } from "next-intl/server";
import AuthPageShell from "@/components/AuthPageShell";
import LoginForm from "./LoginForm";

interface LoginPageProps {
  params: { locale: string };
  searchParams: { error?: string };
}

export default function LoginPage({
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
