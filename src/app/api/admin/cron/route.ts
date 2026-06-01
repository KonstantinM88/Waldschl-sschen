import { NextRequest, NextResponse } from "next/server";
import { processExpiredBookings } from "@/lib/booking-lifecycle";

export const dynamic = "force-dynamic";

/**
 * Automatic room release endpoint for an external scheduler.
 *
 * Auth: set CRON_SECRET in the environment, then call with either
 *   Authorization: Bearer <CRON_SECRET>
 *   or  ?secret=<CRON_SECRET>
 *
 * Example crontab: run every 15 minutes with curl and the Authorization header:
 *   curl -fsS -H "Authorization: Bearer $CRON_SECRET" \
 *     https://your-domain.tld/api/admin/cron
 *
 * Vercel cron (vercel.json):
 *   schedule: every 15 minutes, path: /api/admin/cron
 *   plus CRON_SECRET wired through the Authorization header.
 */
function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();

  // If no secret is configured the endpoint is disabled (fail closed).
  if (!secret) {
    return false;
  }

  const authHeader = request.headers.get("authorization")?.trim();
  if (authHeader === `Bearer ${secret}`) {
    return true;
  }

  const querySecret = request.nextUrl.searchParams.get("secret")?.trim();
  return querySecret === secret;
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processExpiredBookings();
    return NextResponse.json(
      { ok: true, ...result },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Sweep failed",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
