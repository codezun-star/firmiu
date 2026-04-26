import { setRequestLocale } from "next-intl/server";
import AuthPageShell from "@/components/AuthPageShell";
import RegisterForm from "./RegisterForm";

interface RegisterPageProps {
  params: { locale: string };
  searchParams: { plan?: string };
}

export default function RegisterPage({ params: { locale }, searchParams }: RegisterPageProps) {
  setRequestLocale(locale);

  return (
    <AuthPageShell locale={locale}>
      <RegisterForm locale={locale} plan={searchParams.plan} />
    </AuthPageShell>
  );
}
