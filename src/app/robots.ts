import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/menu/print", "/unsubscribe", "/join-the-team/thank-you"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
