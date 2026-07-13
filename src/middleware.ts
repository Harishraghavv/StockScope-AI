import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { COOKIE_NAME } from "@/lib/auth/cookies";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/watchlist",
  "/portfolio",
  "/sectors",
  "/earnings",
  "/profile",
  "/settings",
  "/admin",
  "/screener",
  "/news",
  "/company",
];

const AUTH_PAGES = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  let isAuthenticated = false;
  let isAdmin = false;

  if (token) {
    try {
      const payload = await verifyAccessToken(token);
      isAuthenticated = true;
      isAdmin = payload.role === "ADMIN";
    } catch {
      isAuthenticated = false;
    }
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && isAuthenticated && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/watchlist/:path*",
    "/portfolio/:path*",
    "/sectors/:path*",
    "/earnings/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/screener/:path*",
    "/news/:path*",
    "/company/:path*",
    "/login",
    "/register",
  ],
};
