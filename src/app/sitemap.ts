import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/menu",
    "/about",
    "/faq",
    "/contact",
    "/join-the-team",
    "/privacy",
    "/best-fine-dining-cookeville",
    "/romantic-dinner-cookeville",
    "/private-dining-cookeville",
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
