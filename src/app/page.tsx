import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: { absolute: "Fozzie's Dining | Chef-Driven Fine Dining in Cookeville, TN" },
  description:
    "Discover fine dining in Cookeville, Tennessee at Fozzie's Dining with chef-driven seasonal menus, polished service, and evening reservations.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fine Dining in Cookeville, TN | Fozzie's Dining",
    description:
      "Discover fine dining in Cookeville, Tennessee at Fozzie's Dining with chef-driven seasonal menus and refined hospitality.",
    url: "/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Candlelit table setting at Fozzie's Dining in Cookeville, TN",
      },
    ],
  },
  twitter: {
    title: "Fine Dining in Cookeville, TN | Fozzie's Dining",
    description:
      "Discover fine dining in Cookeville, Tennessee at Fozzie's Dining with chef-driven seasonal menus and refined hospitality.",
    images: ["/og-image.jpg"],
  },
};

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: "Fozzie's Dining",
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}/brand/logo_all_1_hq.png`,
    telephone: "+1-205-873-0686",
    email: "fozziesdining@gmail.com",
    priceRange: "$$$",
    acceptsReservations: `${SITE_URL}/#reserve`,
    hasMenu: `${SITE_URL}/menu`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cookeville",
      addressRegion: "TN",
      addressCountry: "US",
    },
    // Doors open for happy hour (4–6 PM); dinner service runs 5–9 PM.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "16:00",
        closes: "21:00",
      },
    ],
    servesCuisine: ["Southern", "Mediterranean", "Asian", "Cajun", "Hispanic"],
    founder: {
      "@type": "Person",
      "@id": `${SITE_URL}/about#chef-jason-head`,
      name: "Jason Head",
      jobTitle: "Chef & Owner",
    },
    sameAs: ["https://www.instagram.com/fozziesdining/"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Fozzie's Dining",
    alternateName: "Fozzie's",
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#restaurant` },
  },
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      <HomePageClient />
    </>
  );
}
