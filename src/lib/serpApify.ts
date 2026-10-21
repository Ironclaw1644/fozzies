// Pure helpers for the weekly Google rank check (lib/serpSync.ts): the actor
// input and how its one-item-per-SERP-page output becomes one rank per query.
// No Supabase or server-only imports, so it can run under plain node.
//
// Input notes (found on Bond & Fifth, 2026-10-12): apify/google-search-scraper
// ignores `locationUiValue` and `resultsPerPage`. Localisation needs
// `locationUule` and the top 20 needs `maxPagesPerQuery: 2`, which returns a
// separate item per page.

/** Google `uule` for "Cookeville,Tennessee,United States" ("w+CAIQICI" + length char + base64). */
export const COOKEVILLE_UULE = "w+CAIQICIiQ29va2V2aWxsZSxUZW5uZXNzZWUsVW5pdGVkIFN0YXRlcw==";
export const SERP_LOCATION = "Cookeville, TN (uule)";

/** Two Google pages = top ~20. */
export const PAGES_PER_QUERY = 2;

export const SITE_PATTERN = /(^|\.|\/\/)fozziesdining\.com/i;

export function actorInput(queries: string[]) {
  return {
    queries: queries.join("\n"),
    maxPagesPerQuery: PAGES_PER_QUERY,
    countryCode: "us",
    languageCode: "en",
    locationUule: COOKEVILLE_UULE,
    mobileResults: false,
  };
}

type Json = Record<string, unknown>;

export type QueryRank = {
  query: string;
  /** Best organic position for our site across the pages fetched, or null. */
  position: number | null;
  /** Which of our URLs Google chose, without tracking parameters. */
  url: string | null;
  /** Host of the #1 organic result that isn't us (who to beat). */
  topCompetitor: string | null;
  /** Organic results seen across all pages (to tell "not found" from "empty SERP"). */
  organicCount: number;
  /** Whether the SERP carried an AI Overview, and whether it cited us. */
  aiOverview: boolean;
  aiOverviewCitesUs: boolean;
  /** Google showed its Map/Places block (we can't be in it without a Business Profile). */
  localPack: boolean;
};

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * One rank per query from the actor's items (one item per query per page).
 * Page 2 positions normally continue from page 1 (11..20); if a page restarts
 * at 1, the earlier pages' result counts are added so positions stay absolute.
 */
export function ranksFromPages(items: unknown[], sitePattern: RegExp = SITE_PATTERN): QueryRank[] {
  const byQuery = new Map<string, { page: number; item: Json; organic: Json[] }[]>();
  for (const raw of items) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Json;
    const sq = (item.searchQuery as Json | undefined) ?? {};
    const term = typeof sq.term === "string" ? sq.term.trim().toLowerCase() : null;
    if (!term) continue;
    const page = Number(sq.page) || 1;
    const organic = Array.isArray(item.organicResults) ? (item.organicResults as Json[]) : [];
    const list = byQuery.get(term) ?? [];
    list.push({ page, item, organic });
    byQuery.set(term, list);
  }

  const out: QueryRank[] = [];
  for (const [query, pages] of byQuery) {
    pages.sort((a, b) => a.page - b.page);
    let offset = 0;
    const absolute: { position: number; url: string }[] = [];
    let aiOverview = false;
    let aiOverviewCitesUs = false;
    let localPack = false;

    for (const { page, item, organic } of pages) {
      const positions = organic.map((r) => Number(r.position)).filter(Number.isFinite);
      const restarts = page > 1 && positions.length > 0 && Math.min(...positions) === 1;
      const add = restarts ? offset : 0;
      for (const r of organic) {
        const pos = Number(r.position);
        if (Number.isFinite(pos)) absolute.push({ position: pos + add, url: String(r.url ?? "") });
      }
      offset += organic.length;

      const aio = item.aiOverview as Json | undefined;
      if (aio && typeof aio === "object") {
        aiOverview = true;
        if (sitePattern.test(JSON.stringify(aio))) aiOverviewCitesUs = true;
      }
    }

    // The actor lists Google's own Map/Places block as an organic "google.com/search"
    // result. Like the 09-26 manual check, rank counts real web results only.
    const web = absolute
      .sort((a, b) => a.position - b.position)
      .filter((r) => {
        const isGoogle = /(^|\.)google\.[a-z.]+$/.test(host(r.url) ?? "");
        if (isGoogle) localPack = true;
        return !isGoogle;
      });
    const oursAt = web.findIndex((r) => sitePattern.test(r.url));
    const other = web.find((r) => !sitePattern.test(r.url));

    out.push({
      query,
      position: oursAt >= 0 ? oursAt + 1 : null,
      url: oursAt >= 0 ? web[oursAt].url.split("?")[0] : null,
      topCompetitor: other ? host(other.url) : null,
      organicCount: web.length,
      aiOverview,
      aiOverviewCitesUs,
      localPack,
    });
  }
  return out;
}

/** Short human note stored with each row (shown in /admin/seo history). */
export function rankNote(r: QueryRank) {
  const parts = [`Apify Google top ${PAGES_PER_QUERY * 10}, ${r.organicCount} organic seen`];
  if (r.topCompetitor) parts.push(`top other: ${r.topCompetitor}`);
  if (r.localPack) parts.push("map pack shown");
  if (r.aiOverview) parts.push(r.aiOverviewCitesUs ? "AI Overview cites us" : "AI Overview present");
  return parts.join("; ");
}
