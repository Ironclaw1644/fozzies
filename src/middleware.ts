import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminSession } from "@/lib/adminSession";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  // Allow login endpoint through
  if (req.nextUrl.pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const tokenSet = !!process.env.ADMIN_TOKEN;

  // If token isn't even configured, block admin area hard
  if (!tokenSet) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ ok: false, error: "ADMIN_TOKEN not set" }, { status: 500 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("err", "not_configured");
    return NextResponse.redirect(url);
  }

  // Cookie must be a valid signed session
  if (!(await isValidAdminSession(cookie))) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
