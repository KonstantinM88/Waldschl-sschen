import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
  normalizeAdminNextPath,
} from "@/lib/admin-auth";

function clearAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...getAdminSessionCookieOptions(),
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}

export async function GET(request: NextRequest) {
  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  const next = request.nextUrl.searchParams.get("next");

  if (next) {
    loginUrl.searchParams.set("next", normalizeAdminNextPath(next));
  }

  return clearAdminCookie(NextResponse.redirect(loginUrl));
}

export async function POST(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next");

  return clearAdminCookie(
    NextResponse.json({
      success: true,
      redirectTo: next ? normalizeAdminNextPath(next) : ADMIN_LOGIN_PATH,
    })
  );
}
