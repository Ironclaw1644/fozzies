import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BreadcrumbJsonLd, LANDING_LINK_CLASS as L, LandingFaq } from "@/components/landing/LandingFaq";
import { loadMenuSections } from "@/lib/liveMenu";
import { listNames, seafoodDishes, steakDishes, type PickedDish } from "@/lib/menuPicks";
import { FACT_LINE, RESTAURANT } from "@/lib/restaurant";

export const runtime = "nodejs";
// Dish lists come from the live admin menu, refreshed like /menu.
export const revalidate = 300;

const PATH = "/steak-seafood-cookeville";
const TITLE = "Steak and Seafood in Cookeville, TN";
// Dish-agnostic on purpose: metadata is static, the dish lists below follow the live menu.
const DESCRIPTION =
  "Steak and seafood in Cookeville, TN at Fozzie's Dining: steaks and Gulf seafood on Chef Jason Head's seasonal dinner menu, served Tuesday–Saturday, 5–9 PM.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: `${TITLE} | Fozzie's Dining`,
    description: DESCRIPTION,
    url: PATH,
    images: [{ url: "/gallery/salmon_dish.jpg", alt: "Blackened salmon at Fozzie's Dining in Cookeville, TN" }],
  },
  twitter: { title: `${TITLE} | Fozzie's Dining`, description: DESCRIPTION, images: ["/gallery/salmon_dish.jpg"] },
};

function DishList({ dishes }: { dishes: PickedDish[] }) {
  return (
    <ul className="mt-5 space-y-4">
      {dishes.map((d) => (
        <li key={d.name}>
          <h3 className="font-medium text-charcoal">{d.name}</h3>
          {d.desc ? <p className="mt-1 leading-7 text-softgray">{d.desc}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export default async function SteakSeafoodCookevillePage() {
  const sections = await loadMenuSections();
  const steak = sections ? steakDishes(sections) : [];
  const seafood = sections ? seafoodDishes(sections) : [];
  const hasMenu = steak.length > 0 || seafood.length > 0;
  const gfCount = [...steak, ...seafood].filter((d) => d.glutenFree).length;
  const parts = [
    steak.length ? `${listNames(steak)} on the steak side` : "",
    seafood.length ? `${seafood.length === 1 ? "one seafood dish" : `${seafood.length} seafood dishes`}, including ${listNames(seafood.slice(0, 3))}` : "",
  ].filter(Boolean);
  const intro = parts.length
    ? `For steak and seafood, the current menu has ${parts.join(" and ")}.`
    : "Steak and seafood are part of the seasonal dinner menu.";

  // Answers are built from the same lists the page shows, so the FAQ JSON-LD matches the visible text.
  const faq = [
    ...(steak.length
      ? [
          {
            question: "Does Fozzie's Dining serve steak?",
            answer: `Yes. The current dinner menu includes ${listNames(steak)}. Dinner is served Tuesday through Saturday, 5:00–9:00 PM.`,
          },
        ]
      : []),
    {
      question: "Is Fozzie's Dining a steakhouse?",
      answer: steak.length
        ? `No. Fozzie's Dining is a chef-driven restaurant rather than a steakhouse. Its seasonal menu blends Southern cooking with Cajun, Mediterranean, Asian and Hispanic influences, and steak is part of it: right now that's ${listNames(steak)}.`
        : "No. Fozzie's Dining is a chef-driven restaurant rather than a steakhouse. Its seasonal menu blends Southern cooking with Cajun, Mediterranean, Asian and Hispanic influences.",
    },
    ...(seafood.length
      ? [
          {
            question: "What seafood is on the menu at Fozzie's Dining?",
            answer: `The current menu includes ${listNames(seafood)}. The menu changes with the seasons.`,
          },
        ]
      : []),
    {
      question: "Do I need a reservation for dinner?",
      answer: `Reservations are recommended, especially on weekends and for special occasions. Send a request through the reservation form on our home page and the team will confirm by email, or call ${RESTAURANT.phoneDisplay}.`,
    },
    {
      question: "Is there a dress code?",
      answer: RESTAURANT.dressCode,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl bg-ivory px-4 py-12 sm:px-6 sm:py-16">
      <BreadcrumbJsonLd name={TITLE} path={PATH} />

      <section className="mx-auto max-w-4xl text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">{TITLE}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-softgray leading-7">
          {FACT_LINE}{" "}
          {intro}{" "}
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
            src="/gallery/salmon_dish.jpg"
            alt="Blackened salmon with hot honey citrus glaze, sweet potato hash and brussels sprouts at Fozzie's Dining"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 896px) 896px, 100vw"
          />
        </div>
      </section>

      {steak.length ? (
        <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Steak on the Menu</h2>
          <p className="mt-4 text-softgray leading-7">
            Fozzie&apos;s isn&apos;t a steakhouse, but steak has a place on Chef Jason Head&apos;s dinner menu. These are
            the steak dishes being served now, as listed on the menu:
          </p>
          <DishList dishes={steak} />
        </section>
      ) : null}

      {seafood.length ? (
        <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Seafood on the Menu</h2>
          <p className="mt-4 text-softgray leading-7">
            The seafood follows the kitchen&apos;s mix of Southern, Cajun and global influences. These are the
            starters and mains with seafood on the current menu:
          </p>
          <DishList dishes={seafood} />
        </section>
      ) : null}

      {!hasMenu ? (
        <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">See What&apos;s Cooking</h2>
          <p className="mt-4 text-softgray leading-7">
            The menu changes with the seasons. See the current steak and seafood dishes on our{" "}
            <a href="/menu" className={L}>
              dinner menu
            </a>
            .
          </p>
        </section>
      ) : null}

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Gluten-Free and Allergy Notes</h2>
        <p className="mt-4 text-softgray leading-7">
          {gfCount > 0
            ? `The menu marks ${gfCount} of these steak and seafood dishes with a star for gluten-free options. `
            : ""}
          If you have a shellfish or other allergy, add it to the notes on your reservation request so the team knows
          before you arrive. See every dish with gluten-free options on our{" "}
          <a href="/gluten-free-cookeville" className={L}>
            gluten-free dining in Cookeville
          </a>{" "}
          page.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Before Dinner: Happy Hour</h2>
        <p className="mt-4 text-softgray leading-7">
          Happy hour runs Tuesday through Saturday from 4:00 to 6:00 PM, and the bar pours craft cocktails. Dinner
          service starts at 5:00, so you can begin with a drink at the bar and move to the table. The dress code is
          smart casual: jackets are welcome but not required.
        </p>
      </section>

      <LandingFaq heading="Steak and Seafood at Fozzie's: Common Questions" items={faq} />

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Plan Your Dinner</h2>
        <p className="mt-4 text-softgray leading-7">
          Ready to book?{" "}
          <Link href="/#reserve" className={L}>
            Request a table at Fozzie&apos;s
          </Link>{" "}
          or call{" "}
          <a href="tel:+12058730686" className={L}>
            {RESTAURANT.phoneDisplay}
          </a>
          . Celebrating? Plan a{" "}
          <a href="/romantic-dinner-cookeville" className={L}>
            romantic dinner in Cookeville
          </a>
          , bring a group with{" "}
          <a href="/private-dining-cookeville" className={L}>
            private dining in Cookeville
          </a>
          , or see our guide to{" "}
          <a href="/best-fine-dining-cookeville" className={L}>
            fine dining in Cookeville
          </a>
          .
        </p>
      </section>
    </main>
  );
}
