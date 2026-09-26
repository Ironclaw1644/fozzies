import { SITE_URL } from "@/lib/siteUrl";

export type LandingFaqItem = { question: string; answer: string };

export const LANDING_LINK_CLASS = "underline decoration-gold/70 underline-offset-4 hover:text-charcoal";

/** Visible FAQ block plus matching FAQPage JSON-LD (answers must match the visible text). */
export function LandingFaq({ heading, items }: { heading: string; items: LandingFaqItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">{heading}</h2>
      <div className="mt-5 space-y-6">
        {items.map((item) => (
          <div key={item.question}>
            <h3 className="font-medium text-charcoal">{item.question}</h3>
            <p className="mt-1 leading-7 text-softgray">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BreadcrumbJsonLd({ name, path }: { name: string; path: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
