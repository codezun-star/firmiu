import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { locales, defaultLocale } from "./i18n";

// ── next-intl middleware instance ────────────────────────────
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

// ── Route definitions ─────────────────────────────────────────
const PROTECTED = ["/dashboard", "/nueva-contrasena"];
const AUTH_ONLY  = ["/login", "/register", "/recuperar"];

type SBCookie = { name: string; value: string; options?: Partial<ResponseCookie> };

/**
 * Extract locale and canonical path from a URL pathname.
 * With localePrefix:"as-needed", the default locale has no URL prefix.
 */
function parseLocale(pathname: string): { locale: string; path: string } {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(locale.length + 1) || "/" };
    }
  }
  return { locale: defaultLocale, path: pathname };
}

function matchesAny(path: string, patterns: string[]): boolean {
  return patterns.some((p) => path === p || path.startsWith(`${p}/`));
}

// ── Main middleware ───────────────────────────────────────────
export async function middleware(request: NextRequest) {
  // 0. Block malicious URL patterns before any other processing
  const { pathname } = request.nextUrl;
  if (
    pathname.length > 2048 ||
    pathname.includes("\x00") ||
    pathname.includes("..")
  ) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // 1. Refresh Supabase session.
  //    We maintain a mutable response so Supabase can write refreshed-token cookies.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll(): SBCookie[] {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: SBCookie[]): void {
          // Write to request so downstream RSCs see the fresh session
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Rebuild the response with updated request headers
          supabaseResponse = NextResponse.next({ request });
          // Write to response so the browser receives updated tokens
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: keep this call immediately after createServerClient.
  // Nothing should run between them — this is required for session refresh to work correctly.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Determine locale and canonical path
  const { locale, path } = parseLocale(request.nextUrl.pathname);
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  // 3. Redirect unauthenticated users away from protected routes
  if (matchesAny(path, PROTECTED) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `${prefix}/login`;
    return NextResponse.redirect(url);
  }

  // 4. Redirect authenticated users away from login/register
  if (matchesAny(path, AUTH_ONLY) && user) {
    const url = request.nextUrl.clone();
    url.pathname = `${prefix}/dashboard`;
    return NextResponse.redirect(url);
  }

  // 5. Run next-intl locale routing (adds locale prefix, etc.)
  const intlResponse = intlMiddleware(request);

  // 6. Propagate any refreshed Supabase session cookies to the intl response
  supabaseResponse.cookies.getAll().forEach(({ name, value, ...rest }) => {
    intlResponse.cookies.set(name, value, rest as Partial<ResponseCookie>);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/* (Next.js internals)
     * - auth/*  (Supabase OAuth callback — handled by Route Handler directly)
     * - Static assets
     */
    "/((?!_next/static|_next/image|auth|api/paddle|api/cron|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)$).*)",
  ],
};
