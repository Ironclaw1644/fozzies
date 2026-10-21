import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

const DISALLOW = ["/admin", "/api", "/menu/print", "/unsubscribe", "/join-the-team/thank-you"];

// Search and AI-answer crawlers are named explicitly (not just "*") so a future
// blanket rule can't silently drop the restaurant from ChatGPT, Perplexity,
// Claude, Gemini or Copilot answers. ChatGPT search also reads Bing's index.
const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/", disallow: DISALLOW },
      { userAgent: "*", allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
