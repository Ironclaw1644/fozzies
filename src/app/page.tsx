import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { normalizeBannerSettings } from "@/lib/banner";
import { getSettingValue } from "@/lib/settings";
import { restaurantJsonLd, RESTAURANT_ID } from "@/lib/restaurant";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: { absolute: "Fozzie's Dining | Chef-Driven Fine Dining in Cookeville, TN" },
  description:
    "Fozzie's Dining is a chef-driven fine dining restaurant in Cookeville, TN from Chef Jason Head: seasonal menus, dinner Tue–Sat 5–9 PM, happy hour 4–6 PM.",
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
  restaurantJsonLd(),
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Fozzie's Dining",
    alternateName: "Fozzie's",
    url: SITE_URL,
    publisher: { "@id": RESTAURANT_ID },
  },
];

// The banner is rendered on the server so it doesn't push the hero down after load (CLS).
// Saving it in admin calls revalidatePath("/").
export const revalidate = 300;

export default async function HomePage() {
  const banner = normalizeBannerSettings(await getSettingValue<unknown>("site_banner"));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      <HomePageClient initialBanner={banner} />
    </>
  );
}
