// Single source of truth for the canonical site origin.
// NEXT_PUBLIC_SITE_URL should be set in production; the fallback must match
// the canonical host (www) so canonicals/sitemaps never point at a redirect.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.fozziesdining.com";
