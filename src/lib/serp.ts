import { supabaseAdmin } from "@/lib/supabaseAdmin";

// A keyword counts as "ranking" when its latest position is within the first two pages.
export const SERP_DEPTH = 20;
// Deepest position the tracker stores (GSC averages and page 3–10 scrapes can exceed SERP_DEPTH).
export const MAX_POSITION = 100;

export const SERP_SOURCES = ["manual", "websearch", "agent", "gsc", "startpage", "google"] as const;
export type SerpSource = (typeof SERP_SOURCES)[number];

export function isSerpSource(v: string): v is SerpSource {
  return (SERP_SOURCES as readonly string[]).includes(v);
}

/** Found within the first SERP_DEPTH results. */
export function isRanking(c: { found: boolean; position: number | null } | null | undefined) {
  return Boolean(c?.found && c.position !== null && c.position <= SERP_DEPTH);
}

export type SeoKeyword = {
  id: string;
  keyword: string;
  label: string | null;
  target_path: string | null;
  active: boolean;
  created_at: string;
};

export type SerpCheck = {
  id: string;
  keyword: string;
  checked_at: string;
  position: number | null; // 1 = top, one decimal for GSC averages; null = not found
  found: boolean;
  result_url: string | null;
  engine: string;
  location: string | null;
  source: string; // SerpSource
  note: string | null;
  clicks: number | null; // GSC only
  impressions: number | null; // GSC only
  ctr: number | null; // GSC only, 0–1
};

const SCHEMA = "fozzies";
const KW_TABLE = "seo_keywords";
const CHECK_TABLE = "serp_checks";

export async function listKeywords() {
  return supabaseAdmin()
    .schema(SCHEMA)
    .from(KW_TABLE)
    .select("id,keyword,label,target_path,active,created_at")
    .order("created_at", { ascending: true });
}

export async function listChecks(limit = 4000) {
  return supabaseAdmin()
    .schema(SCHEMA)
    .from(CHECK_TABLE)
    .select("id,keyword,checked_at,position,found,result_url,engine,location,source,note,clicks,impressions,ctr")
    .order("checked_at", { ascending: false })
    .limit(limit);
}

type CheckInput = {
  keyword: string;
  position: number | null;
  found: boolean;
  resultUrl?: string | null;
  location?: string | null;
  engine?: string;
  source?: SerpSource;
  note?: string | null;
  checkedAt?: string | null;
  clicks?: number | null;
  impressions?: number | null;
  ctr?: number | null;
};

function checkRow(input: CheckInput) {
  return {
    keyword: input.keyword.trim().toLowerCase(),
    position: input.found && input.position !== null ? Math.round(input.position * 10) / 10 : null,
    found: input.found,
    result_url: input.resultUrl ?? null,
    location: input.location ?? null,
    engine: input.engine ?? "google",
    source: input.source ?? "manual",
    note: input.note ?? null,
    clicks: input.clicks ?? null,
    impressions: input.impressions ?? null,
    ctr: input.ctr ?? null,
    ...(input.checkedAt ? { checked_at: input.checkedAt } : {}),
  };
}

export async function recordCheck(input: CheckInput) {
  if (input.source === "gsc") return upsertGscCheck(input);
  return supabaseAdmin().schema(SCHEMA).from(CHECK_TABLE).insert(checkRow(input));
}

/**
 * GSC rows are one per keyword per UTC day (unique index uq_serp_checks_gsc_daily),
 * so re-running the daily job updates that day's row instead of duplicating it.
 */
export async function upsertGscCheck(input: CheckInput) {
  const row = checkRow({ ...input, source: "gsc" });
  const at = new Date(input.checkedAt ?? Date.now());
  const day = at.toISOString().slice(0, 10);
  const next = new Date(Date.parse(`${day}T00:00:00Z`) + 86_400_000).toISOString();
  const db = () => supabaseAdmin().schema(SCHEMA).from(CHECK_TABLE);

  const existing = await db()
    .select("id")
    .eq("keyword", row.keyword)
    .eq("source", "gsc")
    .gte("checked_at", `${day}T00:00:00Z`)
    .lt("checked_at", next)
    .limit(1);
  if (existing.error) return { error: existing.error };

  const id = existing.data?.[0]?.id as string | undefined;
  if (id) return db().update(row).eq("id", id);
  return db().insert({ ...row, checked_at: row.checked_at ?? at.toISOString() });
}

export async function upsertKeyword(input: {
  keyword: string;
  label?: string | null;
  targetPath?: string | null;
  active?: boolean;
}) {
  return supabaseAdmin()
    .schema(SCHEMA)
    .from(KW_TABLE)
    .upsert(
      {
        keyword: input.keyword.trim().toLowerCase(),
        label: input.label ?? null,
        target_path: input.targetPath ?? null,
        active: input.active ?? true,
      },
      { onConflict: "keyword" }
    );
}

/**
 * Given all checks (newest-first) for a keyword, derive the current standing
 * and the delta vs the prior distinct check.
 */
export function summarizeKeyword(checks: SerpCheck[]) {
  const sorted = [...checks].sort(
    (a, b) => new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime()
  );
  const latest = sorted[0] ?? null;
  const previous = sorted[1] ?? null;

  // Positive delta = moved up (improved). Treat "not found" as MAX_POSITION + 1.
  const rank = (c: SerpCheck | null) =>
    c ? (c.found && c.position ? Number(c.position) : MAX_POSITION + 1) : null;

  const latestRank = rank(latest);
  const prevRank = rank(previous);
  const delta =
    latestRank !== null && prevRank !== null ? Math.round((prevRank - latestRank) * 10) / 10 : null;

  return { latest, previous, delta, history: sorted.slice(0, 12).reverse() };
}
