"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type KeywordOpt = { keyword: string; label: string | null };

const INPUT =
  "w-full rounded border border-charcoal/20 bg-white px-3 py-2 text-sm text-charcoal outline-none focus:border-gold";
const BTN =
  "rounded-full border border-gold px-4 py-2 text-sm font-medium text-charcoal transition hover:bg-gold/15 disabled:opacity-60";

export default function SerpTracker({ keywords }: { keywords: KeywordOpt[] }) {
  const router = useRouter();

  // Log-a-check form
  const [keyword, setKeyword] = useState(keywords[0]?.keyword ?? "");
  const [found, setFound] = useState(true);
  const [position, setPosition] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState("");

  // Add-a-keyword form
  const [newKw, setNewKw] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [kwPending, setKwPending] = useState(false);
  const [kwMsg, setKwMsg] = useState("");

  async function logCheck(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/serp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "check",
          keyword,
          found,
          position: found ? Number(position) : null,
          note: note || null,
          source: "manual",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to save");
      setMsg("Saved ✓");
      setPosition("");
      setNote("");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setPending(false);
    }
  }

  async function addKeyword(e: React.FormEvent) {
    e.preventDefault();
    setKwPending(true);
    setKwMsg("");
    try {
      const res = await fetch("/api/admin/serp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "keyword", keyword: newKw, targetPath: newTarget || null }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to add");
      setKwMsg("Added ✓");
      setNewKw("");
      setNewTarget("");
      router.refresh();
    } catch (err) {
      setKwMsg(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setKwPending(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <form onSubmit={logCheck} className="rounded border border-charcoal/10 bg-ivory/60 p-4">
        <p className="text-[11px] tracking-[0.16em] text-charcoal/70">LOG A RANK CHECK</p>
        <div className="mt-3 space-y-3">
          <select className={INPUT} value={keyword} onChange={(e) => setKeyword(e.target.value)}>
            {keywords.map((k) => (
              <option key={k.keyword} value={k.keyword}>
                {k.keyword}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input type="checkbox" checked={found} onChange={(e) => setFound(e.target.checked)} />
            Ranks in results
          </label>
          {found ? (
            <input
              className={INPUT}
              type="number"
              min={1}
              max={100}
              step="0.1"
              placeholder="Position (1–100)"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          ) : (
            <p className="text-xs text-softgray">Recorded as “not found”.</p>
          )}
          <input
            className={INPUT}
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button className={BTN} disabled={pending}>
              {pending ? "Saving…" : "Save check"}
            </button>
            {msg && <span className="text-xs text-softgray">{msg}</span>}
          </div>
        </div>
      </form>

      <form onSubmit={addKeyword} className="rounded border border-charcoal/10 bg-ivory/60 p-4">
        <p className="text-[11px] tracking-[0.16em] text-charcoal/70">ADD A KEYWORD</p>
        <div className="mt-3 space-y-3">
          <input
            className={INPUT}
            placeholder="e.g. steakhouse cookeville tn"
            value={newKw}
            onChange={(e) => setNewKw(e.target.value)}
            required
          />
          <input
            className={INPUT}
            placeholder="Target page (optional, e.g. /menu)"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button className={BTN} disabled={kwPending}>
              {kwPending ? "Adding…" : "Add keyword"}
            </button>
            {kwMsg && <span className="text-xs text-softgray">{kwMsg}</span>}
          </div>
        </div>
      </form>
    </div>
  );
}
