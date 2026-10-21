import { actorInput, ranksFromPages, rankNote, SERP_LOCATION, type QueryRank } from "@/lib/serpApify";
import { listKeywords, recordCheck, WEEKLY_SERP_KEYWORDS } from "@/lib/serp";

// Weekly localized Google rank check (Vercel Cron, vercel.json) for the
// WEEKLY_SERP_KEYWORDS subset. It writes one 'apify' row per query per run
// into fozzies.serp_checks, next to the Search Console rows, so /admin/seo
// shows a live rank and the GSC average side by side.
//
// Apify's free plan is a $5/month cycle shared with other Luziq sites: 12
// queries x 2 pages is ~$0.11 a run, ~$0.45 a month at weekly.

const ENDPOINT = "https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items";

/** The actor queues before it scrapes; 16 queries x 2 pages took ~2.5 min. */
const TIMEOUT_MS = 280_000;

export type SerpSyncResult = {
  checked: number;
  ranking: number;
  recorded: number;
  errors: string[];
  positions: Pick<QueryRank, "query" | "position" | "url">[];
};

/** Apify's own error text (e.g. the monthly usage cap) so a failed cron says why. Never includes the token. */
async function apifyError(res: Response) {
  try {
    const body = (await res.json()) as { error?: { type?: string; message?: string } };
    const e = body?.error;
    if (e) return [e.type, e.message].filter(Boolean).join(": ").slice(0, 300);
  } catch {
    /* not JSON */
  }
  return res.statusText || "no detail";
}

export async function syncWeeklyRanks(): Promise<SerpSyncResult> {
  const token = process.env.APIFY_API_KEY?.trim();
  if (!token) throw new Error("APIFY_API_KEY is not set.");

  const kw = await listKeywords();
  if (kw.error) throw new Error(`Could not load keywords: ${kw.error.message}`);
  const active = new Set((kw.data ?? []).filter((k) => k.active).map((k) => k.keyword));
  const queries = WEEKLY_SERP_KEYWORDS.filter((q) => active.has(q));
  if (queries.length === 0) return { checked: 0, ranking: 0, recorded: 0, errors: [], positions: [] };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    // Header rather than `?token=`: query strings end up in logs.
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify(actorInput(queries)),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Rank check failed (${res.status}): ${await apifyError(res)}`);
  const items: unknown = await res.json();
  if (!Array.isArray(items)) throw new Error("Rank check returned an unexpected shape.");

  const ranks = ranksFromPages(items);
  const checkedAt = new Date().toISOString();
  const errors: string[] = [];
  let recorded = 0;

  for (const r of ranks) {
    // An empty SERP (0 organic results) is a scrape failure, not "not found".
    if (r.organicCount === 0) {
      errors.push(`${r.query}: no organic results returned`);
      continue;
    }
    const { error } = await recordCheck({
      keyword: r.query,
      found: r.position !== null,
      position: r.position,
      resultUrl: r.url,
      engine: "google",
      source: "apify",
      location: SERP_LOCATION,
      note: rankNote(r),
      checkedAt,
    });
    if (error) errors.push(`${r.query}: ${error.message}`);
    else recorded += 1;
  }

  const seen = new Set(ranks.map((r) => r.query));
  for (const q of queries) if (!seen.has(q)) errors.push(`${q}: missing from Apify output`);

  return {
    checked: ranks.length,
    ranking: ranks.filter((r) => r.position !== null).length,
    recorded,
    errors,
    positions: ranks
      .map(({ query, position, url }) => ({ query, position, url }))
      .sort((a, b) => (a.position ?? 999) - (b.position ?? 999) || a.query.localeCompare(b.query)),
  };
}
