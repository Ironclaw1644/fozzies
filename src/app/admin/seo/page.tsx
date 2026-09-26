import SerpTracker from "@/components/admin/SerpTracker";
import { isRanking, listChecks, listKeywords, summarizeKeyword, MAX_POSITION, SERP_DEPTH, type SerpCheck } from "@/lib/serp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function Sparkline({ points }: { points: number[] }) {
  // points are ranks (1 = best). Invert so higher = better visually.
  if (points.length < 2) return <span className="text-softgray/60">—</span>;
  const w = 90;
  const h = 24;
  const max = MAX_POSITION + 1;
  const step = w / (points.length - 1);
  const y = (p: number) => h - (1 - (Math.min(p, max) - 1) / (max - 1)) * (h - 4) - 2;
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${y(p).toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
    </svg>
  );
}

function positionLabel(c: SerpCheck | null) {
  if (!c) return <span className="text-softgray/60">No data</span>;
  if (!c.found || !c.position) return <span className="text-softgray">Not found</span>;
  const pos = Number(c.position);
  const tone = pos <= 3 ? "text-green-700" : pos <= 10 ? "text-charcoal" : pos <= SERP_DEPTH ? "text-amber-700" : "text-softgray";
  return (
    <span className={`font-medium ${tone}`}>
      #{pos}
      {c.source === "gsc" && <span className="ml-1 text-[10px] font-normal text-softgray">avg</span>}
    </span>
  );
}

function gscCell(c: SerpCheck | null, field: "clicks" | "impressions" | "ctr") {
  if (!c || c.source !== "gsc" || c[field] === null || c[field] === undefined) {
    return <span className="text-softgray/60">—</span>;
  }
  const v = Number(c[field]);
  return field === "ctr" ? `${(v * 100).toFixed(1)}%` : v.toLocaleString();
}

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null || delta === 0) return <span className="text-softgray/60">–</span>;
  const up = delta > 0;
  return (
    <span className={up ? "text-green-700" : "text-red-700"}>
      {up ? "▲" : "▼"} {Math.abs(delta)}
    </span>
  );
}

export default async function SeoPage() {
  const [kwRes, checkRes] = await Promise.all([listKeywords(), listChecks()]);
  const keywords = kwRes.data ?? [];
  const checks = (checkRes.data ?? []) as SerpCheck[];

  const byKeyword = new Map<string, SerpCheck[]>();
  for (const c of checks) {
    const list = byKeyword.get(c.keyword) ?? [];
    list.push(c);
    byKeyword.set(c.keyword, list);
  }

  const rows = keywords.map((k) => {
    const summary = summarizeKeyword(byKeyword.get(k.keyword) ?? []);
    return { keyword: k, ...summary };
  });

  const ranking = rows.filter((r) => isRanking(r.latest)).length;
  const top10 = rows.filter((r) => r.latest?.found && Number(r.latest.position ?? 999) <= 10).length;
  const tracked = rows.length;
  const lastChecked = checks[0]?.checked_at ? new Date(checks[0].checked_at).toLocaleDateString() : "—";

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] tracking-[0.18em] text-softgray">SEO</div>
        <h2 className="mt-1 font-serif text-2xl text-charcoal">SERP Tracker</h2>
        <p className="mt-1 text-sm text-softgray">
          Google positions for target keywords over time. Lower is better; #1–3 is the goal.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Keywords tracked", value: tracked },
          { label: `Ranking (in top ${SERP_DEPTH})`, value: ranking },
          { label: "In top 10", value: top10 },
          { label: "Last updated", value: lastChecked },
        ].map((s) => (
          <div key={s.label} className="rounded border border-charcoal/10 bg-ivory/60 px-4 py-3">
            <div className="text-[11px] tracking-[0.14em] text-softgray">{s.label.toUpperCase()}</div>
            <div className="mt-1 font-serif text-xl text-charcoal">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded border border-charcoal/10">
        <table className="w-full min-w-[960px] text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 bg-ivory/60 text-left text-[11px] tracking-[0.12em] text-softgray">
              <th className="px-3 py-2">KEYWORD</th>
              <th className="px-3 py-2">TARGET</th>
              <th className="px-3 py-2">POSITION</th>
              <th className="px-3 py-2">CHANGE</th>
              <th className="px-3 py-2">CLICKS</th>
              <th className="px-3 py-2">IMPR.</th>
              <th className="px-3 py-2">CTR</th>
              <th className="px-3 py-2">SOURCE</th>
              <th className="px-3 py-2">TREND</th>
              <th className="px-3 py-2">CHECKED</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={10} className="px-3 py-6 text-center text-softgray">
                  No keywords yet — add one below.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.keyword.id} className="border-b border-charcoal/5">
                <td className="px-3 py-2 text-charcoal">{r.keyword.keyword}</td>
                <td className="px-3 py-2 text-softgray">{r.keyword.target_path || "—"}</td>
                <td className="px-3 py-2">{positionLabel(r.latest)}</td>
                <td className="px-3 py-2">
                  <DeltaBadge delta={r.delta} />
                </td>
                <td className="px-3 py-2 text-charcoal">{gscCell(r.latest, "clicks")}</td>
                <td className="px-3 py-2 text-charcoal">{gscCell(r.latest, "impressions")}</td>
                <td className="px-3 py-2 text-charcoal">{gscCell(r.latest, "ctr")}</td>
                <td className="px-3 py-2 text-softgray">{r.latest?.source ?? "—"}</td>
                <td className="px-3 py-2">
                  <Sparkline points={r.history.map((c) => (c.found && c.position ? Number(c.position) : MAX_POSITION + 1))} />
                </td>
                <td className="px-3 py-2 text-softgray">
                  {r.latest?.checked_at ? new Date(r.latest.checked_at).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SerpTracker keywords={keywords.map((k) => ({ keyword: k.keyword, label: k.label }))} />

      <p className="text-xs leading-5 text-softgray">
        Data sources: Google Search Console (daily, &ldquo;avg&rdquo; = impression-weighted average position over the
        trailing 7 days, ~3 days behind, with clicks, impressions and CTR), plus manual and scripted rank checks.
        &ldquo;Ranking&rdquo; means found in the top {SERP_DEPTH}. None of these include the local Map Pack, which is
        driven by your Google Business Profile.
      </p>
    </div>
  );
}
