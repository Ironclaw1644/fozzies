import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/emailMarketing";
import { syncWeeklyRanks } from "@/lib/serpSync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// The Apify run is synchronous and takes a few minutes.
export const maxDuration = 300;

// Weekly Vercel Cron (vercel.json, Tuesdays 10:30 UTC): live Google ranks for
// the WEEKLY_SERP_KEYWORDS, pinned to Cookeville. Failures are logged and
// returned, never swallowed, so Vercel's cron log says why. An admin session
// or x-admin-token can also trigger it, for a one-off check.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const isCron = !!secret && req.headers.get("authorization") === `Bearer ${secret}`;
  if (!isCron && !(await isAdminRequest(req.headers))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncWeeklyRanks();
    if (result.errors.length > 0) console.warn("[cron/serp-apify] partial:", result.errors.join(" | "));
    return NextResponse.json({ ok: result.errors.length === 0, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Rank check failed";
    console.error("[cron/serp-apify]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
