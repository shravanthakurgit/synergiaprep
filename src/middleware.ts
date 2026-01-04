// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { privateRoutes, authRoutes, adminRoutes } from "./route";

const ADMIN_ROLES = ["admin", "superadmin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;

  const role =
    typeof token?.role === "string"
      ? token.role.toLowerCase()
      : null;

  const isAuthRoute = authRoutes.includes(pathname);
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Allow public examprep homepage
  if (pathname === "/examprep") {
    return NextResponse.next();
  }

  // ======================
  // ADMIN ROUTES
  // ======================
  if (isAdminRoute) {
    // Not logged in
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Logged in but not admin
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.redirect(new URL("/examprep", req.url));
    }

    return NextResponse.next();
  }

  // ======================
  // PRIVATE ROUTES
  // ======================
  if (isPrivateRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // ======================
  // AUTH ROUTES (login/register)
  // ======================
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL("/examprep/dashboard", req.url)
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/examprep/dashboard/:path*",
    "/examprep/profile/:path*",
    "/examprep/study-materials/:path*",
    "/examprep/tests/:path*",
    "/examprep/results/:path*",
    "/test-razorpay/:path*",
    "/upload-test/:path*",
    "/login",
    "/register",
  ],
};
