import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAdminCookieName,
  isAdminAuthConfigured,
  readAdminSessionValue,
  shouldBypassAdminAuth,
} from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (shouldBypassAdminAuth()) {
    return NextResponse.next();
  }

  if (!isAdminAuthConfigured()) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "config");
    return NextResponse.redirect(loginUrl);
  }

  const session = await readAdminSessionValue(
    request.cookies.get(getAdminCookieName())?.value,
  );

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
