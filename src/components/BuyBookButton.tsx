"use client";

import { trackEvent } from "@/lib/analytics";
import { track } from "@/lib/trackClient";

/** Outbound Amazon link that records which format and placement got the click. */
export function BuyBookButton({
  href,
  format,
  placement,
  className,
  children,
}: {
  href: string;
  format: string;
  placement: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={className}
      onClick={() => {
        trackEvent("book_buy_click", { format, placement });
        track("book_buy_click", { page_path: window.location.pathname, meta: { format, placement } });
      }}
    >
      {children}
    </a>
  );
}
