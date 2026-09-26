import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

// Date each page's content last changed. Update the entry when you edit a page,
// so Google can trust <lastmod> (a build-time date on every URL would teach it not to).
const ROUTES: Array<[route: string, lastModified: string]> = [
  ["/", "2026-09-26"],
  ["/menu", "2026-09-26"],
  ["/about", "2026-09-26"],
  ["/faq", "2026-09-26"],
  ["/contact", "2026-09-26"],
  ["/join-the-team", "2026-02-18"],
  ["/privacy", "2026-09-26"],
  ["/best-fine-dining-cookeville", "2026-09-26"],
  ["/romantic-dinner-cookeville", "2026-09-26"],
  ["/private-dining-cookeville", "2026-09-26"],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(([route, lastModified]) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
  }));
}
