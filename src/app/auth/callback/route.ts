import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeRedirectPath } from "@/lib/security";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = sanitizeRedirectPath(url.searchParams.get("next"));
  const origin = url.origin;

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check for a pending Paddle plan set by Pricing.tsx before the OAuth redirect
      const pendingPlan = request.cookies.get("firmiu_pending_plan")?.value;

      if (pendingPlan) {
        const response = NextResponse.redirect(
          new URL(`/checkout?plan=${encodeURIComponent(pendingPlan)}`, origin)
        );
        // Clear the cookie so it doesn't trigger again
        response.cookies.set("firmiu_pending_plan", "", { path: "/", maxAge: 0 });
        return response;
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_error`);
}
