import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BreadcrumbJsonLd, LANDING_LINK_CLASS as L, LandingFaq } from "@/components/landing/LandingFaq";
import { loadMenuSections } from "@/lib/liveMenu";
import { glutenFreeDishes, listNames, type PickedDish } from "@/lib/menuPicks";
import { FACT_LINE, RESTAURANT } from "@/lib/restaurant";

export const runtime = "nodejs";
// The list is the live admin menu's gluten-free stars, refreshed like /menu.
export const revalidate = 300;

const PATH = "/gluten-free-cookeville";
const TITLE = "Gluten-Free Dining in Cookeville, TN";
const DESCRIPTION =
  "Gluten-free dining in Cookeville, TN at Fozzie's Dining: every starter, main and dessert marked with gluten-free options, and how to ask ahead.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: `${TITLE} | Fozzie's Dining`,
    description: DESCRIPTION,
    url: PATH,
    images: [{ url: "/gallery/shrimp_and_grits.jpg", alt: "Shrimp and grits at Fozzie's Dining in Cookeville, TN" }],
  },
  twitter: { title: `${TITLE} | Fozzie's Dining`, description: DESCRIPTION, images: ["/gallery/shrimp_and_grits.jpg"] },
};

function bySection(dishes: PickedDish[]) {
  const out: Array<{ section: string; dishes: PickedDish[] }> = [];
  for (const d of dishes) {
    const group = out.find((g) => g.section === d.section);
    if (group) group.dishes.push(d);
    else out.push({ section: d.section, dishes: [d] });
  }
  return out;
}

export default async function GlutenFreeCookevillePage() {
  const sections = await loadMenuSections();
  const gf = sections ? glutenFreeDishes(sections) : [];
  const total = sections ? sections.reduce((n, s) => n + s.items.length, 0) : 0;
  const groups = bySection(gf);
  const desserts = gf.filter((d) => /dessert/i.test(d.section));

  const faq = [
    {
      question: "Does Fozzie's Dining have gluten-free options?",
      answer: gf.length
        ? `Yes. The dinner menu marks ${gf.length} of its ${total} dishes with a star for gluten-free options, across starters, mains and desserts. Ask your server how each one is prepared gluten-free.`
        : "Yes. Gluten-free options are available and marked on the dinner menu. Ask your server how each one is prepared gluten-free.",
    },
    ...(desserts.length
      ? [
          {
            question: "Are there gluten-free desserts?",
            answer: `The menu marks ${listNames(desserts)} with gluten-free options.`,
          },
        ]
      : []),
    {
      question: "Can I note a gluten allergy or celiac disease when I reserve?",
      answer:
        "Yes. The reservation request has a notes field for allergies, celebrations and seating preferences. Say whether it's a preference, an intolerance or celiac disease, so the team knows before you arrive.",
    },
    {
      question: "Is the kitchen certified gluten-free?",
      answer: `No certification is claimed, and the kitchen also cooks dishes that contain gluten. If cross-contact matters for you, call ${RESTAURANT.phoneDisplay} or email ${RESTAURANT.email} before your visit to ask how your dishes will be prepared.`,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl bg-ivory px-4 py-12 sm:px-6 sm:py-16">
      <BreadcrumbJsonLd name={TITLE} path={PATH} />

      <section className="mx-auto max-w-4xl text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">{TITLE}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-softgray leading-7">
          {FACT_LINE}{" "}
          {gf.length
            ? `For gluten-free dining, the menu marks ${gf.length} of its ${total} dishes with gluten-free options, from starters to dessert.`
            : "Gluten-free options are available and marked on the dinner menu."}{" "}
          Dinner is served Tuesday through Saturday, 5:00–9:00 PM.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/#reserve"
            className="inline-block rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal no-underline transition hover:opacity-90"
          >
            Reserve a Table
          </Link>
          <a
            href="/menu"
            className="inline-block rounded-full border border-charcoal/20 px-5 py-2.5 text-sm font-semibold text-charcoal no-underline transition hover:border-gold"
          >
            View the Full Menu
          </a>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-4xl overflow-hidden border border-charcoal/10 bg-cream shadow-sm">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src="/gallery/shrimp_and_grits.jpg"
            alt="Shrimp and grits with Gulf shrimp over gouda grits at Fozzie's Dining"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 896px) 896px, 100vw"
          />
        </div>
      </section>

      {groups.length ? (
        <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Dishes With Gluten-Free Options</h2>
          <p className="mt-4 text-softgray leading-7">
            On the{" "}
            <a href="/menu" className={L}>
              dinner menu
            </a>
            , a gold star marks the dishes with gluten-free options. These are the starred dishes on the current menu.
            Some may need a change to be made gluten-free, so tell your server you&apos;re ordering gluten-free.
          </p>
          {groups.map((g) => (
            <div key={g.section} className="mt-6">
              <h3 className="font-serif text-xl text-charcoal">{g.section}</h3>
              <ul className="mt-3 space-y-3">
                {g.dishes.map((d) => (
                  <li key={d.name}>
                    <span className="font-medium text-charcoal">{d.name}</span>
                    {d.desc ? <span className="text-softgray">: {d.desc}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : (
        <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Dishes With Gluten-Free Options</h2>
          <p className="mt-4 text-softgray leading-7">
            A gold star on the{" "}
            <a href="/menu" className={L}>
              dinner menu
            </a>{" "}
            marks the dishes with gluten-free options.
          </p>
        </section>
      )}

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">How to Ask Ahead</h2>
        <p className="mt-4 text-softgray leading-7">
          The{" "}
          <Link href="/#reserve" className={L}>
            reservation request form
          </Link>{" "}
          has a notes field. Put your gluten needs there, along with any other allergies, and say whether it&apos;s a
          preference, an intolerance or celiac disease. The request goes straight to the team, who confirm by email. For
          a group dinner, include it in your message when you call or email about{" "}
          <a href="/private-dining-cookeville" className={L}>
            private dining in Cookeville
          </a>
          .
        </p>
        <p className="mt-4 text-softgray leading-7">
          The kitchen also cooks dishes that contain gluten, and Fozzie&apos;s claims no gluten-free certification. If
          cross-contact matters to you, call{" "}
          <a href="tel:+12058730686" className={L}>
            {RESTAURANT.phoneDisplay}
          </a>{" "}
          or email{" "}
          <a href="mailto:fozziesdining@gmail.com" className={L}>
            {RESTAURANT.email}
          </a>{" "}
          before your visit.
        </p>
      </section>

      <LandingFaq heading="Gluten-Free at Fozzie's: Common Questions" items={faq} />

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Plan Your Dinner</h2>
        <p className="mt-4 text-softgray leading-7">
          See the steaks and Gulf seafood on our{" "}
          <a href="/steak-seafood-cookeville" className={L}>
            steak and seafood in Cookeville
          </a>{" "}
          page, plan a{" "}
          <a href="/romantic-dinner-cookeville" className={L}>
            romantic dinner in Cookeville
          </a>
          , or answer the rest of your questions on our{" "}
          <a href="/faq" className={L}>
            FAQ
          </a>
          . Ready?{" "}
          <Link href="/#reserve" className={L}>
            Request a table
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
