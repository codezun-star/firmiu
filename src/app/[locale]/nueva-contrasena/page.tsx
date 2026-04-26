import { setRequestLocale } from "next-intl/server";
import AuthPageShell from "@/components/AuthPageShell";
import NuevaContrasenaForm from "./NuevaContrasenaForm";

interface NuevaContrasenaPageProps {
  params: { locale: string };
}

export default function NuevaContrasenaPage({ params: { locale } }: NuevaContrasenaPageProps) {
  setRequestLocale(locale);

  return (
    <AuthPageShell locale={locale}>
      <NuevaContrasenaForm locale={locale} />
    </AuthPageShell>
  );
}
