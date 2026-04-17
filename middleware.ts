import { NextResponse, type NextRequest } from "next/server";

// ── Protected route prefixes ────────────────────────────────

const PROTECTED_PREFIXES = [
  "/surge",      // Austin's internal CRM
  "/platform",   // Client-facing platform (multi-tenant)
  "/dashboard",  // Legacy Agency OS dashboard
];

const COOKIE_NAME = "surge_auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and Next internals (safety net - config below already handles)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Allow the auth page and its API
  if (pathname === "/auth" || pathname === "/auth/") {
    return NextResponse.next();
  }

  // Check if path needs protection
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get(COOKIE_NAME);
  if (!authCookie || authCookie.value !== getExpectedToken()) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Expected cookie value = hash of password env var.
// In middleware (Edge runtime) we can't use Node crypto easily, so we use a
// simple string that's only set after successful login (see /api/auth/login).
function getExpectedToken(): string {
  // The cookie value is literal token "authenticated-[last 8 chars of password]"
  // for a basic tamper check without pulling in crypto libraries.
  const password = process.env.SURGE_ACCESS_PASSWORD || "";
  if (!password) return "no-password-set";
  return `authenticated-${password.slice(-8)}`;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
