import { SITE_URL } from "@/lib/siteUrl";

// Facts about the restaurant that more than one page repeats (JSON-LD, /llms.txt).
// Only what the owner has confirmed and the site already states. Street address,
// ZIP, opening date, price range and capacity are still owed by Chef Jason
// (research/fozzies-onsite-fixes-2026-09-26.md), so they are deliberately absent:
// a guessed value here would be repeated by search engines and AI answers.
export const RESTAURANT = {
  name: "Fozzie's Dining",
  city: "Cookeville",
  region: "TN",
  regionName: "Tennessee",
  phone: "+1-205-873-0686",
  phoneDisplay: "+1 (205) 873-0686",
  email: "fozziesdining@gmail.com",
  instagram: "https://www.instagram.com/fozziesdining/",
  chef: "Jason Head",
  cuisines: ["Southern", "Mediterranean", "Asian", "Cajun", "Hispanic"],
  dinnerHours: "Tuesday–Saturday, 5:00–9:00 PM",
  happyHour: "Tuesday–Saturday, 4:00–6:00 PM",
  dressCode: "Smart casual. Jackets are welcome but not required.",
} as const;

export const RESTAURANT_ID = `${SITE_URL}/#restaurant`;

/** Full Restaurant node. Rendered on the home page; other pages reference it by @id. */
export function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": RESTAURANT_ID,
    name: RESTAURANT.name,
    description:
      "Chef-driven restaurant in Cookeville, Tennessee from Chef Jason Head, serving a seasonal dinner menu with Southern, Cajun, Mediterranean, Asian and Hispanic influences.",
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}/brand/logo_all_1_hq.png`,
    telephone: RESTAURANT.phone,
    email: RESTAURANT.email,
    acceptsReservations: `${SITE_URL}/#reserve`,
    hasMenu: `${SITE_URL}/menu`,
    address: {
      "@type": "PostalAddress",
      addressLocality: RESTAURANT.city,
      addressRegion: RESTAURANT.region,
      addressCountry: "US",
    },
    areaServed: { "@type": "City", name: `${RESTAURANT.city}, ${RESTAURANT.regionName}` },
    // Doors open for happy hour (4–6 PM); dinner service runs 5–9 PM.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "16:00",
        closes: "21:00",
      },
    ],
    servesCuisine: [...RESTAURANT.cuisines],
    founder: {
      "@type": "Person",
      "@id": `${SITE_URL}/about#chef-jason-head`,
      name: RESTAURANT.chef,
      jobTitle: "Chef & Owner",
    },
    sameAs: [RESTAURANT.instagram],
  };
}
