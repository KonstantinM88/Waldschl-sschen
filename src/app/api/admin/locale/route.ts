import { NextRequest, NextResponse } from "next/server";
import { normalizeAdminNextPath } from "@/lib/admin-auth";
import {
  ADMIN_LOCALE_COOKIE,
  getAdminLocaleCookieOptions,
  resolveAdminLocale,
} from "@/lib/admin-i18n";

export async function GET(request: NextRequest) {
  const nextPath = normalizeAdminNextPath(request.nextUrl.searchParams.get("next"));
  const locale = resolveAdminLocale(request.nextUrl.searchParams.get("lang"));
  const response = NextResponse.redirect(new URL(nextPath, request.url));

  response.cookies.set(ADMIN_LOCALE_COOKIE, locale, getAdminLocaleCookieOptions());

  return response;
}
