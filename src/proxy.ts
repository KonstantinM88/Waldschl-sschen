import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import {
  ADMIN_DASHBOARD_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE,
  normalizeAdminNextPath,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";
import {routing} from "@/lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAdminRoute = pathname === ADMIN_DASHBOARD_PATH || pathname.startsWith(`${ADMIN_DASHBOARD_PATH}/`);

  if (isAdminRoute) {
    const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = await verifyAdminSessionToken(sessionToken);
    const isLoginRoute = pathname === ADMIN_LOGIN_PATH;

    if (!session && !isLoginRoute) {
      const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
      loginUrl.searchParams.set("next", normalizeAdminNextPath(`${pathname}${search}`));
      return NextResponse.redirect(loginUrl);
    }

    if (session && isLoginRoute) {
      const nextPath = normalizeAdminNextPath(request.nextUrl.searchParams.get("next"));
      return NextResponse.redirect(new URL(nextPath, request.url));
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
