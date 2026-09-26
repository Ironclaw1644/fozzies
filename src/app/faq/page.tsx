import type { Metadata } from "next";
import { getDefaultFaqPayload, parseFaqPayload } from "@/lib/faqSettings";
import { getSettingValue } from "@/lib/settings";

export const runtime = "nodejs";
// Static with background refresh; admin saves call revalidatePath() for instant updates.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "FAQ: Hours, Dress Code and Reservations",
  description: "Answers about Fozzie's Dining in Cookeville, TN: dinner and happy hour times, dress code, reservations, gluten-free options, private parties and catering.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ: Hours, Dress Code and Reservations | Fozzie's Dining",
    description: "Answers about Fozzie's Dining in Cookeville, TN: dinner and happy hour times, dress code, reservations, gluten-free options, private parties and catering.",
    url: "/faq",
    images: [
      {
        url: "/brand/logo_all_1_hq.png",
        alt: "Fozzie's Dining logo",
      },
    ],
  },
  twitter: {
    title: "FAQ: Hours, Dress Code and Reservations | Fozzie's Dining",
    description: "Answers about Fozzie's Dining in Cookeville, TN: dinner and happy hour times, dress code, reservations, gluten-free options, private parties and catering.",
    images: ["/brand/logo_all_1_hq.png"],
  },
};

export default async function FAQPage() {
  const defaults = getDefaultFaqPayload();
  let faqPayload = defaults;
  const storedFaq = await getSettingValue<unknown>("faq_page");
  if (storedFaq) {
    const parsed = parseFaqPayload(storedFaq);
    if (parsed) faqPayload = parsed;
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqPayload.sections.flatMap((section) =>
      section.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      }))
    ),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-charcoal">
            {/* The admin default title is just "FAQ"; give the page a specific H1. */}
            {faqPayload.title.trim().toLowerCase() === "faq" ? "Fozzie's Dining FAQ" : faqPayload.title}
          </h1>
          {faqPayload.subtitle ? <p className="mx-auto mt-3 max-w-2xl text-softgray">{faqPayload.subtitle}</p> : null}
          <div className="mx-auto mt-6 h-px w-24 bg-warmgold" />
        </div>
        <div className="mt-10 space-y-6">
          {faqPayload.sections.map((section) => (
            <section key={section.id} className="border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
              <h2 className="font-serif text-2xl text-charcoal">{section.heading}</h2>
              <div className="mt-5 space-y-6">
                {section.items.map((item) => (
                  <div key={item.id}>
                    <div className="font-medium text-charcoal">{item.question}</div>
                    <div className="mt-1 space-y-1 leading-7 text-softgray">
                      {item.answer.split("\n").map((line, idx) => (
                        <p key={`${item.id}-${idx}`}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-softgray">
          Still have a question?{" "}
          <a href="/contact" className="underline decoration-gold/70 underline-offset-4 hover:text-charcoal">
            Contact us
          </a>{" "}
          or{" "}
          <a href="/#reserve" className="underline decoration-gold/70 underline-offset-4 hover:text-charcoal">
            reserve a table
          </a>
          .
        </p>
      </div>
    </main>
  );
}
