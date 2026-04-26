import { setRequestLocale } from "next-intl/server";
import AuthPageShell from "@/components/AuthPageShell";
import RecuperarForm from "./RecuperarForm";

interface RecuperarPageProps {
  params: { locale: string };
}

export default function RecuperarPage({ params: { locale } }: RecuperarPageProps) {
  setRequestLocale(locale);

  return (
    <AuthPageShell locale={locale}>
      <RecuperarForm locale={locale} />
    </AuthPageShell>
  );
}
