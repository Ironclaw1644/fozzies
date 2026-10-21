import { loadMenuSections } from "@/lib/liveMenu";
import { ABOUT_FAQ, FINE_DINING_FAQ, PRIVATE_DINING_FAQ, ROMANTIC_DINNER_FAQ, type FaqEntry } from "@/lib/faqs";
import { FACT_LINE, RESTAURANT } from "@/lib/restaurant";
import { SITE_URL } from "@/lib/siteUrl";

export const runtime = "nodejs";
// Same refresh as /menu, so dish names follow admin menu edits.
export const revalidate = 300;

const norm = (s: string) => s.replace(/[\u2018\u2019]/g, "'").trim().toLowerCase();

// The About and landing-page FAQs, word for word, minus repeats and minus any
// answer naming a dish that isn't on the live menu (or every dish answer when the
// menu can't be read).
function commonQuestions(liveDishes: Set<string> | null): FaqEntry[] {
  const questions: string[] = [];
  const answers: string[] = [];
  return [...ABOUT_FAQ, ...FINE_DINING_FAQ, ...ROMANTIC_DINNER_FAQ, ...PRIVATE_DINING_FAQ].filter((f) => {
    if (f.dishes?.some((d) => !liveDishes?.has(norm(d)))) return false;
    const q = norm(f.question);
    const a = norm(f.answer);
    if (questions.includes(q) || answers.some((seen) => seen.includes(a) || a.includes(seen))) return false;
    questions.push(q);
    answers.push(a);
    return true;
  });
}

// /llms.txt (llmstxt.org): a plain-text brief for AI assistants. Built from the
// same facts as the JSON-LD, the live menu and the page FAQs, never hand-written,
// so it can't drift from the site. Unknown facts (street address, prices, opening
// date) are left out rather than guessed.
export async function GET() {
  const sections = await loadMenuSections();
  const r = RESTAURANT;
  const menu = sections
    ? sections
        .filter((s) => s.items.length > 0)
        .map((s) => `- ${s.title}: ${s.items.map((i) => i.name.trim()).join("; ")}`)
        .join("\n")
    : `The menu changes with the seasons; see ${SITE_URL}/menu`;
  const liveDishes = sections ? new Set(sections.flatMap((s) => s.items.map((i) => norm(i.name)))) : null;
  const faq = commonQuestions(liveDishes)
    .map((f) => `### ${f.question}\n${f.answer}`)
    .join("\n\n");

  const body = `# ${r.name}

> ${FACT_LINE}

## Key facts
- Location: ${r.city}, ${r.regionName} (United States)
- Chef and owner: ${r.chef}, born and raised in Birmingham, Alabama; founded the catering company GameDay Gourmet in 2021
- Name: from Jason's college nickname "Fozzie" (for his red beard). A different restaurant from Fozzie's Sandwich Emporium (Missouri) and Fozzy's Bar & Grill (Franklin and Spring Hill, TN).
- Dinner: ${r.dinnerHours}
- Happy hour: ${r.happyHour}
- Dress code: ${r.dressCode}
- Reservations: recommended, especially weekends and special occasions. Request online at ${SITE_URL}/#reserve (the team confirms by email) or call ${r.phoneDisplay}.
- Parties of 10 or more and offsite catering: call ${r.phoneDisplay} or email ${r.email}
- Gluten-free options are available and marked on the menu.
- Instagram: ${r.instagram}

## Current dinner menu
${menu}

## Common questions
${faq}

## Pages
- [Home and reservations](${SITE_URL}/)
- [Dinner menu](${SITE_URL}/menu)
- [About Chef Jason Head](${SITE_URL}/about)
- [Fine dining in Cookeville](${SITE_URL}/best-fine-dining-cookeville)
- [Romantic dinner in Cookeville](${SITE_URL}/romantic-dinner-cookeville)
- [Private and group dining in Cookeville](${SITE_URL}/private-dining-cookeville)
- [FAQ: hours, dress code, reservations](${SITE_URL}/faq)
- [Contact](${SITE_URL}/contact)
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=0, s-maxage=300" },
  });
}
