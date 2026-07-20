import { NextResponse } from "next/server";

const PRIVATE_PREFIXES = [
  "/dashboard",
  "/upload",
  "/jobs",
  "/invoices",
  "/reports",
  "/profile",
  "/settings",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get("bip_auth")?.value === "1";
  const isPrivateRoute = PRIVATE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/upload/:path*",
    "/jobs/:path*",
    "/invoices/:path*",
    "/reports/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
  ],
};
