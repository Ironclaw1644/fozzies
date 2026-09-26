import Image from "next/image";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteUrl";

const ABOUT_DESCRIPTION =
  "Meet Chef Jason Head, the Birmingham-born chef behind Fozzie's Dining in Cookeville, TN: globally inspired cooking rooted in Southern hospitality.";

export const metadata: Metadata = {
  title: "About Chef Jason Head",
  description: ABOUT_DESCRIPTION,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Chef Jason Head | Fozzie's Dining",
    description: ABOUT_DESCRIPTION,
    url: "/about",
    images: [
      {
        url: "/gallery/chef_plating.jpg",
        alt: "Chef plating a dish at Fozzie's Dining",
      },
    ],
  },
  twitter: {
    title: "About Chef Jason Head | Fozzie's Dining",
    description: ABOUT_DESCRIPTION,
    images: ["/gallery/chef_plating.jpg"],
  },
};

const chefJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/about#chef-jason-head`,
  name: "Jason Head",
  alternateName: "Fozzie",
  jobTitle: "Chef & Owner",
  url: `${SITE_URL}/about`,
  image: `${SITE_URL}/gallery/chef_portrait.jpg`,
  birthPlace: { "@type": "Place", name: "Birmingham, Alabama" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Mississippi" },
  worksFor: { "@type": "Restaurant", "@id": `${SITE_URL}/#restaurant`, name: "Fozzie's Dining", url: SITE_URL },
  knowsAbout: ["Southern cuisine", "Mediterranean cuisine", "Asian cuisine", "Cajun cuisine", "Hispanic cuisine", "Catering"],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "About Chef Jason Head", item: `${SITE_URL}/about` },
  ],
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([chefJsonLd, breadcrumbJsonLd]) }}
      />

      <div className="mb-16 overflow-hidden border border-charcoal/10 bg-cream">
        <div className="relative h-[60vh] min-h-[420px] w-full">
          <Image
            src="/gallery/chef_plating.jpg"
            alt="Chef Jason Head plating a dish at the kitchen pass at Fozzie's Dining"
            fill
            className="object-cover object-[50%_35%]"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/15 to-transparent"></div>
        </div>
      </div>

      <div className="max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal">
          About Chef Jason Head
        </h1>

        <p className="mt-4 text-softgray tracking-wide">
          Chef-driven. Globally inspired. Rooted in Southern hospitality.
        </p>

        <div className="mt-6 h-px w-24 bg-warmgold"></div>
      </div>

      <div className="mt-16 grid gap-16 md:grid-cols-2">
        <div className="space-y-8 text-charcoal leading-8">
          <p>
            Born and raised in Birmingham, Alabama, Chef Jason Head brings to Cookeville a culinary journey shaped by travel, discipline, and a lifelong love of hospitality. A graduate of the University of Mississippi with a degree in Music (Voice), his early years were marked by exploration—traveling to more than fifteen countries across the Caribbean, Central America, and Europe, and even spending time in Fairbanks, Alaska.
          </p>

          <p>
            Before stepping fully into the culinary world, he spent nearly two decades in the securities industry—an experience that refined his leadership, work ethic, and commitment to excellence. In 2021, he founded GameDay Gourmet, a catering company known for elevated tailgate spreads, holiday gatherings, and private celebrations—where his passion for bringing people together truly took shape.
          </p>

          <p>
            While in college, Jason earned the nickname “Fozzie,” inspired by his bright red beard and natural ability to make others smile. The name stuck—reflecting both his warmth and the welcoming spirit that defines his kitchen today.
          </p>
        </div>

        <div className="space-y-8 text-charcoal leading-8">
          <p>
            Influenced by Mediterranean, Asian, Cajun, Hispanic, and classic Southern traditions, Chef Jason’s cuisine blends global inspiration with regional comfort. Each dish is thoughtfully crafted—refined, yet approachable—designed to create experiences that linger long after the last bite.
          </p>

          <div>
            <p className="text-sm uppercase tracking-widest text-softgray">
              His Philosophy
            </p>

            <p className="mt-4 font-serif text-2xl md:text-3xl text-charcoal">
              Food brings people together, and the most meaningful memories are made at the table.
            </p>
          </div>

          <p>
            Whether it’s a celebration, a quiet dinner, or a gathering of old friends, he believes hospitality should feel both elevated and deeply personal. With deep family ties to Cookeville since 2001 and a heart rooted in service, he is honored to share his vision with the community—and looks forward to welcoming you to Fozzie’s.
          </p>
        </div>
      </div>

      <div className="mt-16 max-w-3xl text-charcoal leading-8">
        <p>
          See what Chef Jason is cooking now on the{" "}
          <a href="/menu" className="underline decoration-gold/70 underline-offset-4 hover:text-charcoal">
            Fozzie&apos;s dinner menu
          </a>
          , from Nana&apos;s Shrimp &amp; Grits to Hallie Kay&apos;s Filet Mignon. Planning an evening? Start with{" "}
          <a
            href="/best-fine-dining-cookeville"
            className="underline decoration-gold/70 underline-offset-4 hover:text-charcoal"
          >
            fine dining in Cookeville
          </a>
          , a{" "}
          <a
            href="/romantic-dinner-cookeville"
            className="underline decoration-gold/70 underline-offset-4 hover:text-charcoal"
          >
            romantic dinner for two
          </a>
          , or{" "}
          <a
            href="/private-dining-cookeville"
            className="underline decoration-gold/70 underline-offset-4 hover:text-charcoal"
          >
            private dining for a larger group
          </a>
          .
        </p>
      </div>

      {/* Elevated Signature Section */}
      <div className="mt-24 flex flex-col items-center">

        <div className="h-px w-24 bg-warmgold/70 mb-8"></div>

        <div className="relative w-52 h-20 opacity-60">
          <Image
            src="/brand/fozzie_sig.png"
            alt="Chef Jason Head's signature"
            fill
            className="object-contain"
          />
        </div>

        <p className="mt-4 font-serif text-sm text-charcoal/70 tracking-wide">
          — Chef Jason Head
        </p>

      </div>

    </main>
  );
}
