import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import {
  privateRoutes,
  authRoutes,
  adminRoutes,
} from "./route";
import { RoleType } from "@prisma/client";

export const runtime = "nodejs"; 

const { auth } = NextAuth(authConfig);

export const middleware = auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const res = NextResponse.next();

  const isLoggedIn = !!req.auth;

  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = req.auth?.user?.role?.toUpperCase();
    if (
      role !== RoleType.ADMIN &&
      role !== RoleType.SUPERADMIN
    ) {
      return NextResponse.redirect(
        new URL("/examprep/dashboard", nextUrl)
      );
    }

    return res;
  }

  // Private routes
  if (isPrivateRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth routes
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(
      new URL("/examprep/dashboard", nextUrl)
    );
  }

  return res;
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/superadmin/:path*",
    "/examprep/:path*",
    "/test-razorpay/:path*",
    "/upload-test/:path*",
  ],
};
