import { loadMenuSections } from "@/lib/liveMenu";
import { RESTAURANT } from "@/lib/restaurant";
import { SITE_URL } from "@/lib/siteUrl";

export const runtime = "nodejs";
// Same refresh as /menu, so dish names follow admin menu edits.
export const revalidate = 300;

// /llms.txt (llmstxt.org): a plain-text brief for AI assistants. Built from the
// same facts as the JSON-LD and the live menu, never hand-written, so it can't
// drift from the site. Unknown facts (street address, prices, opening date)
// are left out rather than guessed.
export async function GET() {
  const sections = await loadMenuSections();
  const r = RESTAURANT;
  const menu = sections
    .filter((s) => s.items.length > 0)
    .map((s) => `- ${s.title}: ${s.items.map((i) => i.name.trim()).join("; ")}`)
    .join("\n");

  const body = `# ${r.name}

> ${r.name} is a chef-driven fine dining restaurant in ${r.city}, ${r.regionName}, from Chef ${r.chef}. The seasonal dinner menu blends Southern cooking with ${r.cuisines.filter((c) => c !== "Southern").join(", ")} influences.

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
