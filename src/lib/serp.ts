import { supabaseAdmin } from "@/lib/supabaseAdmin";

// How deep a SERP check looks before calling a keyword "not ranking".
export const SERP_DEPTH = 20;

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
  position: number | null; // 1 = top; null = not found within SERP_DEPTH
  found: boolean;
  result_url: string | null;
  engine: string;
  location: string | null;
  source: string; // 'manual' | 'websearch' | 'agent'
  note: string | null;
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
    .select("id,keyword,checked_at,position,found,result_url,engine,location,source,note")
    .order("checked_at", { ascending: false })
    .limit(limit);
}

export async function recordCheck(input: {
  keyword: string;
  position: number | null;
  found: boolean;
  resultUrl?: string | null;
  location?: string | null;
  source?: string;
  note?: string | null;
}) {
  return supabaseAdmin()
    .schema(SCHEMA)
    .from(CHECK_TABLE)
    .insert({
      keyword: input.keyword.trim().toLowerCase(),
      position: input.found ? input.position : null,
      found: input.found,
      result_url: input.resultUrl ?? null,
      location: input.location ?? null,
      source: input.source ?? "manual",
      note: input.note ?? null,
    });
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

  // Positive delta = moved up (improved). Treat "not found" as SERP_DEPTH + 1.
  const rank = (c: SerpCheck | null) =>
    c ? (c.found && c.position ? c.position : SERP_DEPTH + 1) : null;

  const latestRank = rank(latest);
  const prevRank = rank(previous);
  const delta =
    latestRank !== null && prevRank !== null ? prevRank - latestRank : null;

  return { latest, previous, delta, history: sorted.slice(0, 12).reverse() };
}
