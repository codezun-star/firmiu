import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CheckoutClient from "./CheckoutClient";

interface CheckoutPageProps {
  params: { locale: string };
  searchParams: { plan?: string };
}

export default async function CheckoutPage({ params: { locale }, searchParams }: CheckoutPageProps) {
  setRequestLocale(locale);

  const prefix = locale === "es" ? "" : `/${locale}`;
  const priceId = searchParams.plan ?? null;

  if (!priceId) {
    redirect(`${prefix}/dashboard`);
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`${prefix}/login`);
  }

  return (
    <CheckoutClient
      locale={locale}
      priceId={priceId}
      userEmail={user.email ?? ""}
      userId={user.id}
    />
  );
}
