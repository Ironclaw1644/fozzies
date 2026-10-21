// Where a visit came from, in plain buckets, with AI assistants called out.
// Pure (no server imports) so the browser tracker and the admin dashboard
// classify the same way. Inputs are document.referrer and utm_source.

export type SourceChannel =
  | "ai-chatgpt"
  | "ai-perplexity"
  | "ai-copilot"
  | "ai-gemini"
  | "ai-claude"
  | "google"
  | "bing"
  | "duckduckgo"
  | "instagram"
  | "facebook"
  | "email"
  | "other"
  | "direct";

const RULES: Array<[SourceChannel, RegExp]> = [
  ["ai-chatgpt", /(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com)$|^chatgpt/],
  ["ai-perplexity", /(^|\.)perplexity(\.ai)?$|^perplexity/],
  ["ai-copilot", /(^|\.)copilot\.microsoft\.com$|^copilot|(^|\.)copilot\.com$/],
  ["ai-gemini", /(^|\.)gemini\.google\.com$|(^|\.)bard\.google\.com$|^gemini/],
  ["ai-claude", /(^|\.)claude\.ai$|^claude/],
  // Before google: webmail lives on mail.google.com.
  ["email", /^(email|newsletter|resend)$|(^|\.)(mail\.google\.com|outlook\.live\.com)$/],
  ["google", /(^|\.)google\.[a-z.]+$|^google$/],
  ["bing", /(^|\.)bing\.com$|^bing$/],
  ["duckduckgo", /(^|\.)duckduckgo\.com$/],
  ["instagram", /(^|\.)instagram\.com$|^l\.instagram\.com$|^ig$|^instagram/],
  ["facebook", /(^|\.)facebook\.com$|(^|\.)fb\.com$|^fb$|^facebook/],
];

export const CHANNEL_LABELS: Record<SourceChannel, string> = {
  "ai-chatgpt": "ChatGPT (AI)",
  "ai-perplexity": "Perplexity (AI)",
  "ai-copilot": "Copilot (AI)",
  "ai-gemini": "Gemini (AI)",
  "ai-claude": "Claude (AI)",
  google: "Google",
  bing: "Bing",
  duckduckgo: "DuckDuckGo",
  instagram: "Instagram",
  facebook: "Facebook",
  email: "Email",
  other: "Other website",
  direct: "Direct / unknown",
};

export function isAiChannel(c: string | null | undefined) {
  return !!c && c.startsWith("ai-");
}

function hostOf(referrer: string | null | undefined) {
  if (!referrer) return null;
  try {
    return new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * utm_source wins (ChatGPT search appends utm_source=chatgpt.com to links),
 * then the referrer host. Our own host counts as direct: internal navigation
 * is not a source.
 */
export function classifySource(input: {
  referrer?: string | null;
  utmSource?: string | null;
  ownHost?: string | null;
}): SourceChannel {
  const utm = input.utmSource?.trim().toLowerCase().replace(/^www\./, "");
  if (utm) {
    for (const [channel, re] of RULES) if (re.test(utm)) return channel;
    return "other";
  }
  const host = hostOf(input.referrer);
  const own = input.ownHost?.toLowerCase().replace(/^www\./, "");
  if (!host || (own && host === own) || host.endsWith("fozziesdining.com")) return "direct";
  for (const [channel, re] of RULES) if (re.test(host)) return channel;
  return "other";
}
