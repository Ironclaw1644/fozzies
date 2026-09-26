import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/emailMarketing";
import {
  isSerpSource,
  listChecks,
  listKeywords,
  recordCheck,
  upsertKeyword,
  MAX_POSITION,
  SERP_SOURCES,
} from "@/lib/serp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await isAdminRequest(req.headers))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const [kw, checks] = await Promise.all([listKeywords(), listChecks()]);
  if (kw.error || checks.error) {
    return NextResponse.json({ ok: false, error: "Failed to load SERP data." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, keywords: kw.data ?? [], checks: checks.data ?? [] });
}

export async function POST(req: Request) {
  if (!(await isAdminRequest(req.headers))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const action = String(body.action || "check");

  if (action === "keyword") {
    const keyword = String(body.keyword || "").trim();
    if (!keyword) return NextResponse.json({ ok: false, error: "Keyword is required" }, { status: 400 });
    const { error } = await upsertKeyword({
      keyword,
      label: body.label ? String(body.label) : null,
      targetPath: body.targetPath ? String(body.targetPath) : null,
      active: body.active === undefined ? true : Boolean(body.active),
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // Default: record a rank observation.
  const keyword = String(body.keyword || "").trim();
  if (!keyword) return NextResponse.json({ ok: false, error: "Keyword is required" }, { status: 400 });

  const found = Boolean(body.found);
  let position: number | null = null;
  if (found) {
    const p = Number(body.position);
    if (!Number.isFinite(p) || p < 1 || p > MAX_POSITION) {
      return NextResponse.json(
        { ok: false, error: `Position must be a number 1–${MAX_POSITION} (one decimal allowed) when found.` },
        { status: 400 }
      );
    }
    position = Math.round(p * 10) / 10;
  }

  const source = body.source ? String(body.source).trim().toLowerCase() : "manual";
  if (!isSerpSource(source)) {
    return NextResponse.json(
      { ok: false, error: `Source must be one of: ${SERP_SOURCES.join(", ")}.` },
      { status: 400 }
    );
  }

  let checkedAt: string | null = null;
  if (body.checkedAt) {
    const t = Date.parse(String(body.checkedAt));
    if (Number.isNaN(t)) return NextResponse.json({ ok: false, error: "checkedAt must be an ISO date." }, { status: 400 });
    checkedAt = new Date(t).toISOString();
  }

  const optNum = (v: unknown) => {
    if (v === undefined || v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };
  const clicks = optNum(body.clicks);
  const impressions = optNum(body.impressions);
  const ctr = optNum(body.ctr);

  const { error } = await recordCheck({
    keyword,
    position,
    found,
    resultUrl: body.resultUrl ? String(body.resultUrl) : null,
    location: body.location ? String(body.location) : null,
    engine: body.engine ? String(body.engine) : undefined,
    source,
    note: body.note ? String(body.note) : null,
    checkedAt,
    clicks: clicks === null ? null : Math.round(clicks),
    impressions: impressions === null ? null : Math.round(impressions),
    ctr: ctr !== null && ctr <= 1 ? ctr : null,
  });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
