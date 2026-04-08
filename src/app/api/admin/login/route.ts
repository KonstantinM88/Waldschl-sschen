import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  isAdminAuthConfigured,
  normalizeAdminNextPath,
  validateAdminCredentials,
} from "@/lib/admin-auth";

const loginSchema = z.object({
  next: z.string().optional(),
  password: z.string().min(1).max(256),
  username: z.string().min(1).max(120),
});

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthConfigured()) {
      return NextResponse.json(
        {
          success: false,
          code: "NOT_CONFIGURED",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const validated = loginSchema.parse(body);
    const isValid = await validateAdminCredentials(validated.username, validated.password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    const sessionToken = await createAdminSessionToken(validated.username);
    const response = NextResponse.json({
      success: true,
      redirectTo: normalizeAdminNextPath(validated.next),
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, getAdminSessionCookieOptions());

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, code: "INVALID_PAYLOAD", issues: error.flatten() },
        { status: 400 }
      );
    }

    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
