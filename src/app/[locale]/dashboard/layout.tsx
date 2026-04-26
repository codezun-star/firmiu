import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";
import PendingPlanChecker from "@/components/PendingPlanChecker";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function DashboardLayout({
  children,
  params: { locale },
}: DashboardLayoutProps) {
  setRequestLocale(locale);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rawName =
    (user?.user_metadata?.nombre as string | undefined) ?? user?.email ?? "";
  const userInitials = rawName
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const email  = user?.email ?? "";
  const userId = user?.id ?? "";

  const { data: sub } = await supabase
    .from("suscripciones")
    .select("plan, estado")
    .eq("owner_id", userId)
    .maybeSingle();

  const currentPlan = (sub?.estado === "active" ? sub?.plan : null) ?? "free";

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <DashboardNav locale={locale} userName={rawName} userInitials={userInitials} />
      <PendingPlanChecker email={email} userId={userId} currentPlan={currentPlan} />
      <main className="md:ml-[200px] pt-[52px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
