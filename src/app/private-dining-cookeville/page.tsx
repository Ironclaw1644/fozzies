import Image from "next/image";
import type { Metadata } from "next";
import { BreadcrumbJsonLd, LANDING_LINK_CLASS as L, LandingFaq } from "@/components/landing/LandingFaq";

const DESCRIPTION =
  "Host a group dinner or celebration at Fozzie's Dining in Cookeville, TN: a chef-driven seasonal menu, parties of 10+ by phone or email, and catering.";

export const metadata: Metadata = {
  title: "Private Dining in Cookeville, TN",
  description: DESCRIPTION,
  alternates: {
    canonical: "/private-dining-cookeville",
  },
  openGraph: {
    title: "Private Dining in Cookeville, TN | Fozzie's Dining",
    description: DESCRIPTION,
    url: "/private-dining-cookeville",
    images: [
      {
        url: "/gallery/dining_room_1.png",
        alt: "Dining room at Fozzie's Dining in Cookeville, TN",
      },
    ],
  },
  twitter: {
    title: "Private Dining in Cookeville, TN | Fozzie's Dining",
    description: DESCRIPTION,
    images: ["/gallery/dining_room_1.png"],
  },
};

const FAQ = [
  {
    question: "How do I book a dinner for a large group?",
    answer:
      "For parties of 10 or more, please call +1 (205) 873-0686 or email fozziesdining@gmail.com. Smaller groups can use the reservation request form on our home page, and the team will confirm by email.",
  },
  {
    question: "Does Fozzie's Dining cater offsite events?",
    answer: "Please call or email with requests for offsite events.",
  },
  {
    question: "What are the hours?",
    answer: "Dinner is served Tuesday through Saturday, 5:00–9:00 PM. Happy hour is Tuesday through Saturday, 4:00–6:00 PM.",
  },
  {
    question: "What's on the menu?",
    answer:
      "A seasonal, chef-driven menu with starters like crab cakes and Waka Waka Shrimp, mains like Nana's Shrimp & Grits, Smoky Mountain Surf & Turf and Hallie Kay's Filet Mignon, and desserts like crème brûlée. Gluten-free options are available.",
  },
  {
    question: "Is there a dress code?",
    answer: "Smart casual. Jackets are welcome but not required.",
  },
];

export default function PrivateDiningCookevillePage() {
  return (
    <main className="mx-auto max-w-6xl bg-ivory px-4 py-12 sm:px-6 sm:py-16">
      <BreadcrumbJsonLd name="Private Dining in Cookeville, TN" path="/private-dining-cookeville" />

      <section className="mx-auto max-w-4xl text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">Private Dining in Cookeville, TN</h1>
        <p className="mx-auto mt-4 max-w-3xl text-softgray leading-7">
          Fozzie&apos;s Dining provides a refined setting for rehearsal dinners, business occasions, and personal
          celebrations that call for exceptional food and attentive service.
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
            src="/gallery/dining_room_1.png"
            alt="Elegant dining room at Fozzie's Dining, set for a private gathering"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 896px) 896px, 100vw"
          />
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Refined Space for Important Gatherings</h2>
        <p className="mt-4 text-softgray leading-7">
          From intimate parties to polished corporate dinners, our team helps you host with confidence in a setting
          that feels both elevated and welcoming.
        </p>
        <p className="mt-4 text-softgray leading-7">
          The room is set with white tablecloths and candlelight, the bar pours craft cocktails, and service is
          unhurried, which suits a toast, a speech or a long conversation between courses. The dress code is smart
          casual, with jackets welcome but not required, so guests coming straight from work fit in as easily as those
          dressed for a celebration.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Booking for a Group</h2>
        <p className="mt-4 text-softgray leading-7">
          For parties of 10 or more, please call{" "}
          <a href="tel:+12058730686" className={L}>
            +1 (205) 873-0686
          </a>{" "}
          or email{" "}
          <a href="mailto:fozziesdining@gmail.com" className={L}>
            fozziesdining@gmail.com
          </a>{" "}
          so the team can plan the evening with you. It helps to share the date, the time you&apos;d like to sit down,
          your headcount and what you&apos;re celebrating. Mention any allergies or dietary needs in the same
          message, so they&apos;re part of the plan from the start; gluten-free options are available.
        </p>
        <p className="mt-4 text-softgray leading-7">
          For smaller groups, the{" "}
          <a href="/#reserve" className={L}>
            reservation request form
          </a>{" "}
          works well: pick a date, time and party size, add notes such as allergies, a celebration or seating
          preferences, and the team will confirm by email. Reservations are recommended, especially on weekends and for
          special occasions.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Customized Menus and Service</h2>
        <p className="mt-4 text-softgray leading-7">
          Chef-led planning allows each event to reflect your occasion. Review style and seasonal direction on our{" "}
          <a href="/menu" className={L}>
            menu
          </a>
          .
        </p>
        <p className="mt-4 text-softgray leading-7">
          Chef Jason Head&apos;s cooking draws on Southern, Cajun, Mediterranean, Asian and Hispanic traditions, which
          gives a mixed table plenty of range. The current menu includes starters such as lump crab cakes, Waka Waka
          Shrimp and stuffed portobello caps; mains from Nana&apos;s Shrimp &amp; Grits and Smoked Pork Belly with a
          sweet chili glaze to Smoky Mountain Surf &amp; Turf and Hallie Kay&apos;s Filet Mignon; and desserts like
          bread pudding and crème brûlée. Gluten-free options are available, and many dishes are marked gluten-free.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Catering and Offsite Events</h2>
        <p className="mt-4 text-softgray leading-7">
          Hosting somewhere else? Please call or email with requests for offsite events. In 2021, Chef Jason
          founded GameDay Gourmet, a catering company known for elevated tailgate spreads, holiday
          gatherings and private celebrations, so feeding a crowd away from the restaurant is familiar ground.{" "}
          <a href="/about" className={L}>
            Read Chef Jason&apos;s story
          </a>
          .
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Hours</h2>
        <p className="mt-4 text-softgray leading-7">
          Dinner is served Tuesday through Saturday from 5:00 to 9:00 PM, and happy hour runs Tuesday through Saturday
          from 4:00 to 6:00 PM. A group that arrives for happy hour can ease from the bar into dinner.
        </p>
      </section>

      <LandingFaq heading="Group and Private Dining: Common Questions" items={FAQ} />

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Plan Your Private Dining Experience</h2>
        <p className="mt-4 text-softgray leading-7">
          For availability, group details, and special requests, start with our{" "}
          <a href="/contact" className={L}>
            contact page
          </a>
          .
        </p>
        <p className="mt-4 text-softgray leading-7">
          Ready to book now?{" "}
          <a href="/#reserve" className={L}>
            Reserve a table at Fozzie&apos;s
          </a>
          .
        </p>
        <p className="mt-4 text-softgray leading-7">
          Hosting just the two of you? Plan a{" "}
          <a href="/romantic-dinner-cookeville" className={L}>
            romantic dinner in Cookeville
          </a>{" "}
          or start with the{" "}
          <a href="/best-fine-dining-cookeville" className={L}>
            best fine dining in Cookeville
          </a>
          .
        </p>
      </section>
    </main>
  );
}
