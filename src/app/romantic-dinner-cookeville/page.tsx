import Image from "next/image";
import type { Metadata } from "next";
import { BreadcrumbJsonLd, LANDING_LINK_CLASS as L, LandingFaq } from "@/components/landing/LandingFaq";

export const metadata: Metadata = {
  title: "Romantic Dinner in Cookeville, TN",
  description:
    "Plan a romantic dinner in Cookeville at Fozzie's Dining, where chef-driven menus, warm ambiance, and attentive service create unforgettable evenings.",
  alternates: {
    canonical: "/romantic-dinner-cookeville",
  },
  openGraph: {
    title: "Romantic Dinner in Cookeville, TN | Fozzie's Dining",
    description:
      "Plan a romantic dinner in Cookeville at Fozzie's Dining, where chef-driven menus, warm ambiance, and attentive service create unforgettable evenings.",
    url: "/romantic-dinner-cookeville",
    images: [
      {
        url: "/gallery/dining_detail.jpg",
        alt: "Candlelit table for two at Fozzie's Dining in Cookeville, TN",
      },
    ],
  },
  twitter: {
    title: "Romantic Dinner in Cookeville, TN | Fozzie's Dining",
    description:
      "Plan a romantic dinner in Cookeville at Fozzie's Dining, where chef-driven menus, warm ambiance, and attentive service create unforgettable evenings.",
    images: ["/gallery/dining_detail.jpg"],
  },
};

const FAQ = [
  {
    question: "Is Fozzie's Dining a good place for a date night or anniversary?",
    answer:
      "It's built for evenings like that: candlelit, white-tablecloth tables, an unhurried pace and a chef-driven seasonal menu. Mention the occasion in the notes on your reservation request.",
  },
  {
    question: "What should I wear?",
    answer: "The dress code is smart casual. Jackets are welcome but not required.",
  },
  {
    question: "When can we come in?",
    answer:
      "Happy hour is Tuesday through Saturday, 4:00–6:00 PM, and dinner is served Tuesday through Saturday, 5:00–9:00 PM.",
  },
  {
    question: "How do we book a table for two?",
    answer:
      "Use the reservation request form on our home page with your date, time and party size, and the team will confirm by email. You can also call +1 (205) 873-0686. Reservations are recommended, especially on weekends and for special occasions.",
  },
  {
    question: "Can we note an allergy ahead of time?",
    answer:
      "Yes. The reservation request has a notes field for allergies, celebrations and seating preferences. Gluten-free options are available, and many dishes are marked gluten-free on the menu.",
  },
];

export default function RomanticDinnerCookevillePage() {
  return (
    <main className="mx-auto max-w-6xl bg-ivory px-4 py-12 sm:px-6 sm:py-16">
      <BreadcrumbJsonLd name="Romantic Dinner in Cookeville, TN" path="/romantic-dinner-cookeville" />

      <section className="mx-auto max-w-4xl text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">Romantic Dinner in Cookeville, TN</h1>
        <p className="mx-auto mt-4 max-w-3xl text-softgray leading-7">
          For anniversaries, first dates, and quiet celebrations, Fozzie&apos;s Dining offers a setting where
          conversation lingers and every course feels intentional.
        </p>
        <div className="mt-8">
          <a
            href="/#reserve"
            className="inline-block rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal no-underline transition hover:opacity-90"
          >
            Reserve a Table
          </a>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-4xl overflow-hidden border border-charcoal/10 bg-cream shadow-sm">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src="/gallery/dining_detail.jpg"
            alt="Candlelit white-tablecloth table set for two at Fozzie's Dining"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 896px) 896px, 100vw"
          />
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Designed for Date Night</h2>
        <p className="mt-4 text-softgray leading-7">
          Soft light, elegant plating, and a polished pace create an intimate backdrop without feeling formal or
          rushed. It&apos;s upscale dining with genuine warmth.
        </p>
        <p className="mt-4 text-softgray leading-7">
          Tables are dressed in white tablecloths and lit by candles, and the pace is unhurried, so a dinner for two
          can take the whole evening if you want it to. The dress code is smart casual: jackets are welcome but not
          required, so it&apos;s easy to dress up a little without it feeling like an event.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Start at the Bar</h2>
        <p className="mt-4 text-softgray leading-7">
          Happy hour runs Tuesday through Saturday from 4:00 to 6:00 PM, and dinner is served from 5:00 to 9:00 PM.
          Meeting at the bar for a craft cocktail before you sit down is a relaxed way to begin a date, and it gives
          the evening a first chapter before the first course.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">A Menu Made for Sharing</h2>
        <p className="mt-4 text-softgray leading-7">
          Seasonal dishes and signature favorites are prepared to be shared, savored, and remembered. Split a starter
          such as the Waka Waka Shrimp, the lump crab cakes with corn relish, or the seasonal flatbread. For the main
          course, Chef Jason Head&apos;s menu runs from Hallie Kay&apos;s Filet Mignon with peppercorn cream sauce and
          Steak Frites made with a wagyu flat iron to B &amp; C&apos;s Salmon with a hot honey citrus glaze and a Thai
          Curry Crawfish Étouffée over jasmine rice.
        </p>
        <p className="mt-4 text-softgray leading-7">
          Save room for dessert: crème brûlée, a brownie sundae with salted caramel ice cream, or Edie&apos;s Mousse of
          the Week. The menu changes with the seasons, so preview the current dishes on our{" "}
          <a href="/menu" className={L}>
            dinner menu
          </a>
          .
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Tell Us What You&apos;re Celebrating</h2>
        <p className="mt-4 text-softgray leading-7">
          Reservations are recommended, especially on weekends and for special occasions. The{" "}
          <a href="/#reserve" className={L}>
            reservation request form
          </a>{" "}
          takes your date, time and party size, and it has a notes field for allergies, celebrations and seating
          preferences. If it&apos;s an anniversary, a birthday or a proposal you&apos;re planning, say so there. Your
          request goes straight to the team, who confirm by email.
        </p>
        <p className="mt-4 text-softgray leading-7">
          Chef Jason&apos;s philosophy is simple: food brings people together, and the most meaningful memories are
          made at the table. It&apos;s the idea behind the restaurant&apos;s motto, &ldquo;Moments Turned to
          Memories.&rdquo;{" "}
          <a href="/about" className={L}>
            Meet Chef Jason Head
          </a>
          .
        </p>
      </section>

      <LandingFaq heading="Romantic Dinners at Fozzie's: Common Questions" items={FAQ} />

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Reserve or Reach Out</h2>
        <p className="mt-4 text-softgray leading-7">
          For special requests before your evening, visit our{" "}
          <a href="/contact" className={L}>
            contact page
          </a>{" "}
          or call{" "}
          <a href="tel:+12058730686" className={L}>
            +1 (205) 873-0686
          </a>
          .
        </p>
        <p className="mt-4 text-softgray leading-7">
          Ready for the evening?{" "}
          <a href="/#reserve" className={L}>
            Reserve a table at Fozzie&apos;s
          </a>
          .
        </p>
        <p className="mt-4 text-softgray leading-7">
          Making it a bigger occasion? Explore{" "}
          <a href="/private-dining-cookeville" className={L}>
            private dining in Cookeville
          </a>{" "}
          or see why Fozzie&apos;s is called the{" "}
          <a href="/best-fine-dining-cookeville" className={L}>
            best fine dining in Cookeville
          </a>
          .
        </p>
      </section>
    </main>
  );
}
