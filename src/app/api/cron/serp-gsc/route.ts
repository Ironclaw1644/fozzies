import { NextResponse } from "next/server";
import { fetchGscPositions, gscConfig } from "@/lib/gsc";
import { listKeywords, upsertGscCheck } from "@/lib/serp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Daily Vercel Cron (vercel.json): pulls Search Console positions for the tracked keywords
// and stores one 'gsc' row per keyword per day (re-runs update that day's row).
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET not configured" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!gscConfig()) {
    return NextResponse.json(
      { ok: false, error: "GSC not configured", missing: ["GSC_SITE_URL", "GSC_CLIENT_EMAIL", "GSC_PRIVATE_KEY"] },
      { status: 503 }
    );
  }

  const kw = await listKeywords();
  if (kw.error) return NextResponse.json({ ok: false, error: "Failed to load keywords" }, { status: 500 });
  const keywords = (kw.data ?? []).filter((k) => k.active).map((k) => k.keyword);

  let result: Awaited<ReturnType<typeof fetchGscPositions>>;
  try {
    result = await fetchGscPositions(keywords);
  } catch (err) {
    const message = err instanceof Error ? err.message : "GSC request failed";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }

  // Rows are dated at the end of the GSC window (data lags ~3 days).
  const checkedAt = `${result.window.endDate}T12:00:00.000Z`;
  const location = "GSC avg (all locations)";
  const note = `Search Console, ${result.window.startDate} to ${result.window.endDate}`;
  const errors: string[] = [];
  let recorded = 0;

  for (const t of result.tracked) {
    const row =
      "missing" in t
        ? { keyword: t.keyword, found: false, position: null, clicks: 0, impressions: 0, ctr: 0, resultUrl: null }
        : {
            keyword: t.keyword,
            found: true,
            position: t.position,
            clicks: t.clicks,
            impressions: t.impressions,
            ctr: t.ctr,
            resultUrl: t.topPage,
          };
    const { error } = await upsertGscCheck({
      ...row,
      engine: "google",
      source: "gsc",
      location,
      note: "missing" in t ? `${note}: no impressions` : note,
      checkedAt,
    });
    if (error) errors.push(`${t.keyword}: ${error.message}`);
    else recorded += 1;
  }

  return NextResponse.json({
    ok: errors.length === 0,
    window: result.window,
    recorded,
    errors,
    topUntrackedQueries: result.topUntracked,
  });
}
