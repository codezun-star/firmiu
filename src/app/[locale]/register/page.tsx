import { setRequestLocale } from "next-intl/server";
import AuthPageShell from "@/components/AuthPageShell";
import RegisterForm from "./RegisterForm";

interface RegisterPageProps {
  params: { locale: string };
}

export default function RegisterPage({ params: { locale } }: RegisterPageProps) {
  setRequestLocale(locale);

  return (
    <AuthPageShell locale={locale}>
      <RegisterForm locale={locale} />
    </AuthPageShell>
  );
}
