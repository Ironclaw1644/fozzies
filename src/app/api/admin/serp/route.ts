import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/emailMarketing";
import { listChecks, listKeywords, recordCheck, upsertKeyword, SERP_DEPTH } from "@/lib/serp";

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
    if (!Number.isInteger(p) || p < 1 || p > SERP_DEPTH) {
      return NextResponse.json(
        { ok: false, error: `Position must be an integer 1–${SERP_DEPTH} when found.` },
        { status: 400 }
      );
    }
    position = p;
  }

  const { error } = await recordCheck({
    keyword,
    position,
    found,
    resultUrl: body.resultUrl ? String(body.resultUrl) : null,
    location: body.location ? String(body.location) : null,
    source: body.source ? String(body.source) : "manual",
    note: body.note ? String(body.note) : null,
  });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
