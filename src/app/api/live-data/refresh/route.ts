import { NextRequest } from "next/server";
import { refreshLiveQuotes } from "@/lib/live-data/refresh-service";
import { apiSuccess, apiError } from "@/lib/api-response";

// This endpoint is meant to be called on a schedule (e.g. a Vercel Cron
// Job hitting it every few minutes), not by end users clicking around —
// that's what keeps us within Twelve Data's free-tier rate limit instead
// of calling it on every dashboard page view.
//
// Protected by a shared secret (CRON_SECRET in .env) so randoms on the
// internet can't trigger refreshes and burn through the daily quota.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided = req.nextUrl.searchParams.get("secret");

  if (secret && provided !== secret) {
    return apiError("Not authorized.", 401);
  }

  const result = await refreshLiveQuotes();
  return apiSuccess(result);
}
