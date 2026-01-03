// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { privateRoutes, authRoutes, adminRoutes } from "./route";
import { getToken } from "next-auth/jwt";


const ADMIN_ROLES = ["admin", "superadmin"];


export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Determine login by presence of auth/session cookies.
  const cookieHeader = req.headers.get("cookie") || "";
  const sessionCookie =
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("next-auth.callback-url")?.value ||
    (cookieHeader.includes("authjs") ? cookieHeader : undefined) ||
    (cookieHeader.includes("next-auth") ? cookieHeader : undefined) ||
    undefined;

  const isLoggedIn = Boolean(sessionCookie && cookieHeader.length > 0);
  const isAuthRoute = authRoutes.includes(pathname);

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoutes = adminRoutes.some((route) => pathname.startsWith(route));

  // Allow access to examprep homepage without login
  if (pathname === "/examprep") {
    return NextResponse.next();
  }

  // Private route handling
  if (isPrivateRoute) {
    if (!isLoggedIn) {
      const redirectUrl = new URL("/dummy", nextUrl);
      redirectUrl.searchParams.set("next", nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // Admin route handling
  if (isAdminRoutes) {

    const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.JWT_SECRET,
  });

  // Not logged in
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = typeof token.role === "string"
    ? token.role.toLowerCase()
    : undefined;


  // Logged in but not admin
  if (!role || !ADMIN_ROLES.includes(role)) {
      const redirectUrl = new URL("/login", nextUrl);
      return NextResponse.redirect(redirectUrl);
  }
  return res;
  }

  // Auth route handling
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/examprep/dashboard", nextUrl));
    }
    return res;
  }

  return res;
};

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
  ],
};
