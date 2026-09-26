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

  // Headless API clients (rank-check scripts) may send the admin token directly;
  // it is the same secret the login endpoint accepts.
  const headerToken = req.headers.get("x-admin-token");
  if (req.nextUrl.pathname.startsWith("/api/") && headerToken && headerToken === process.env.ADMIN_TOKEN) {
    return NextResponse.next();
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
