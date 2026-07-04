import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 1. Capture referral code from URL and set cookie
  const refCode = searchParams.get("ref");
  const response = NextResponse.next();

  if (refCode) {
    response.cookies.set("referral_code", refCode, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
      httpOnly: false,
    });
  }

  // 2. Protect dashboard and referral pages
  const protectedPaths = ["/dashboard", "/referral"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|favicon|.*\\.).*)"],
};
