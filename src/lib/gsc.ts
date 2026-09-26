import { createSign } from "node:crypto";

// Google Search Console (Search Analytics) client using a service account.
// Env: GSC_SITE_URL (e.g. "sc-domain:fozziesdining.com"), GSC_CLIENT_EMAIL, GSC_PRIVATE_KEY
// (the key's private_key; literal "\n" escapes are fine). The service account must be added
// as a (Restricted) user on the Search Console property.

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export type GscConfig = { siteUrl: string; clientEmail: string; privateKey: string };

export type GscKeywordStat = {
  keyword: string;
  position: number; // impression-weighted average, one decimal
  clicks: number;
  impressions: number;
  ctr: number; // 0–1
  topPage: string | null;
};

export type GscQueryRow = { query: string; position: number; clicks: number; impressions: number; ctr: number };

export function gscConfig(): GscConfig | null {
  const siteUrl = process.env.GSC_SITE_URL?.trim();
  const clientEmail = process.env.GSC_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GSC_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  if (!siteUrl || !clientEmail || !privateKey) return null;
  return { siteUrl, clientEmail, privateKey };
}

const b64url = (v: string | Buffer) => Buffer.from(v).toString("base64url");

async function accessToken(cfg: GscConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({ iss: cfg.clientEmail, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 })
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const jwt = `${header}.${claims}.${b64url(signer.sign(cfg.privateKey))}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as { access_token?: string; error?: string };
  if (!res.ok || !json.access_token) throw new Error(`GSC token exchange failed (${res.status} ${json.error ?? ""})`);
  return json.access_token;
}

type ApiRow = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

async function query(cfg: GscConfig, token: string, body: Record<string, unknown>): Promise<ApiRow[]> {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(cfg.siteUrl)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ type: "web", dataState: "final", rowLimit: 25000, ...body }),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as { rows?: ApiRow[]; error?: { message?: string } };
  if (!res.ok) throw new Error(`GSC query failed (${res.status}): ${json.error?.message ?? "unknown error"}`);
  return json.rows ?? [];
}

const ymd = (d: Date) => d.toISOString().slice(0, 10);

/** Trailing window ending `lagDays` ago (GSC data is ~2–3 days behind). */
export function gscWindow(days = 7, lagDays = 3) {
  const end = new Date(Date.now() - lagDays * 86_400_000);
  const start = new Date(end.getTime() - (days - 1) * 86_400_000);
  return { startDate: ymd(start), endDate: ymd(end) };
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Per tracked keyword: impression-weighted average position, clicks, impressions, CTR and the
 * landing page with the most impressions, over the window. Also returns the site's top queries
 * so untracked opportunities can be surfaced.
 */
export async function fetchGscPositions(keywords: string[], window = gscWindow()) {
  const cfg = gscConfig();
  if (!cfg) throw new Error("GSC not configured");
  const token = await accessToken(cfg);

  const [byQuery, byQueryPage] = await Promise.all([
    query(cfg, token, { ...window, dimensions: ["query"] }),
    query(cfg, token, { ...window, dimensions: ["query", "page"] }),
  ]);

  const topPage = new Map<string, { page: string; impressions: number }>();
  for (const r of byQueryPage) {
    const [q, page] = r.keys;
    const cur = topPage.get(q);
    if (!cur || r.impressions > cur.impressions) topPage.set(q, { page, impressions: r.impressions });
  }

  const rows: GscQueryRow[] = byQuery.map((r) => ({
    query: r.keys[0],
    position: round1(r.position),
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
  }));
  const byKey = new Map(rows.map((r) => [r.query.toLowerCase(), r]));

  const tracked: Array<GscKeywordStat | { keyword: string; missing: true }> = keywords.map((k) => {
    const r = byKey.get(k.toLowerCase());
    if (!r) return { keyword: k, missing: true as const };
    return {
      keyword: k,
      position: r.position,
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      topPage: topPage.get(r.query)?.page ?? null,
    };
  });

  const trackedSet = new Set(keywords.map((k) => k.toLowerCase()));
  const topUntracked = rows
    .filter((r) => !trackedSet.has(r.query.toLowerCase()))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 25);

  return { window, tracked, topUntracked };
}
