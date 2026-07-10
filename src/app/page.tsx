import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Fine Dining in Cookeville, TN",
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

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Fozzie's Dining",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: "+1-931-261-7163",
  email: "fozziesdining@gmail.com",
  priceRange: "$$$",
  acceptsReservations: "True",
  hasMenu: `${SITE_URL}/menu`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cookeville",
    addressRegion: "TN",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "17:00",
      closes: "21:00",
    },
  ],
  servesCuisine: ["Southern", "Mediterranean", "Asian", "Cajun", "Hispanic"],
  founder: {
    "@type": "Person",
    name: "Jason Head",
    jobTitle: "Chef & Owner",
  },
  sameAs: ["https://instagram.com/fozziesdining"],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      <HomePageClient />
    </>
  );
}
