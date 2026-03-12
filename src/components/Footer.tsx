"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return null;
  }

  return (
    <footer className="border-t border-charcoal/10 bg-cream py-6 text-sm text-softgray">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 sm:px-6 md:flex-row md:justify-between">
        <Link
          href="/privacy"
          className="text-softgray no-underline transition hover:text-charcoal hover:underline"
        >
          Privacy Policy
        </Link>
        <div className="flex flex-col items-center gap-1">
          <p className="text-softgray/80">© Fozzie&apos;s Dining 2026</p>
          <a
            href="https://walkperro.com"
            target="_blank"
            rel="noreferrer"
            className="text-charcoal/70 no-underline transition hover:underline hover:underline-offset-4"
          >
            Powered by WalkPerro
          </a>
        </div>
      </div>
    </footer>
  );
}
