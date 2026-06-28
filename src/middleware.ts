import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { locales, defaultLocale } from "./i18n";

// ── Maintenance page (self-contained HTML, served with 503) ──────────────────
const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Firmiu — En mantenimiento</title>
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
background:#F8F9FA;color:#111827;padding:24px}
.card{max-width:440px;width:100%;background:#fff;border:1px solid #E5E7EB;border-radius:16px;
padding:40px 32px;text-align:center;box-shadow:0 10px 40px rgba(16,24,40,.06)}
.logo{font-size:22px;font-weight:800;color:#1a3c5e;letter-spacing:-.5px;margin-bottom:24px}
.logo span{color:#F97316}
.icon{width:64px;height:64px;border-radius:18px;background:#FFF7ED;border:1px solid #FED7AA;
display:flex;align-items:center;justify-content:center;margin:0 auto 20px}
.icon svg{width:30px;height:30px;color:#F97316;animation:spin 8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
h1{font-size:19px;margin:0 0 8px}
p{font-size:14px;line-height:1.6;color:#6B7280;margin:0 0 6px}
.en{font-size:12px;color:#9CA3AF;margin-top:14px}
.dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#F97316;margin-right:6px;animation:pulse 1.4s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
</style></head><body>
<div class="card">
<div class="logo">firm<span>iu</span></div>
<div class="icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
<h1><span class="dot"></span>Estamos haciendo mejoras</h1>
<p>Firmiu está temporalmente en mantenimiento. Volvemos en unos minutos. Gracias por tu paciencia.</p>
<p class="en">We're making improvements. Firmiu is temporarily down for maintenance and will be back shortly.</p>
</div></body></html>`;

/**
 * Maintenance flag. Today: MAINTENANCE_MODE env var ("true" = on; toggling needs
 * a redeploy). To make it INSTANT (no redeploy) later, move it to Vercel Edge
 * Config: install @vercel/edge-config, make this async, and
 * `return (await get("maintenance")) === true || process.env.MAINTENANCE_MODE === "true";`
 */
function isMaintenanceOn(): boolean {
  return process.env.MAINTENANCE_MODE === "true";
}

// ── next-intl middleware instance ────────────────────────────
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
});

// ── Route definitions ─────────────────────────────────────────
const PROTECTED = ["/dashboard", "/nueva-contrasena", "/checkout"];
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

  // 0.5 Maintenance mode. Paddle webhooks + crons are excluded by the matcher, so
  //     payments keep flowing while users see the maintenance page.
  if (isMaintenanceOn()) {
    const bypassSecret = process.env.MAINTENANCE_BYPASS;
    // Owner bypass: visiting /?bypass=<secret> drops a cookie and cleans the URL,
    // so you can keep using the live site while everyone else is gated.
    if (bypassSecret) {
      const qp = request.nextUrl.searchParams.get("bypass");
      if (qp && qp === bypassSecret) {
        const clean = request.nextUrl.clone();
        clean.searchParams.delete("bypass");
        const res = NextResponse.redirect(clean);
        res.cookies.set("firmiu_maint_bypass", bypassSecret, {
          path: "/", maxAge: 60 * 60 * 24, httpOnly: true, sameSite: "lax",
        });
        return res;
      }
    }
    const bypassed = !!bypassSecret && request.cookies.get("firmiu_maint_bypass")?.value === bypassSecret;
    if (!bypassed) {
      return new NextResponse(MAINTENANCE_HTML, {
        status: 503,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "Retry-After": "3600",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }
    // bypassed → fall through to the normal middleware below
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
    "/((?!_next/static|_next/image|auth|api/paddle|api/cron|api/og|api/logo|apple-icon|manifest\\.webmanifest|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|mjs|webmanifest)$).*)",
  ],
};
