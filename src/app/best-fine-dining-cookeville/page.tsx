import Image from "next/image";
import type { Metadata } from "next";
import { BreadcrumbJsonLd, LANDING_LINK_CLASS as L, LandingFaq } from "@/components/landing/LandingFaq";

export const metadata: Metadata = {
  title: "Best Fine Dining in Cookeville, TN",
  description:
    "Discover chef-driven fine dining in Cookeville at Fozzie's Dining with seasonal menus, polished service, and an atmosphere made for meaningful evenings.",
  alternates: {
    canonical: "/best-fine-dining-cookeville",
  },
  openGraph: {
    title: "Best Fine Dining in Cookeville, TN | Fozzie's Dining",
    description:
      "Discover chef-driven fine dining in Cookeville at Fozzie's Dining with seasonal menus, polished service, and an atmosphere made for meaningful evenings.",
    url: "/best-fine-dining-cookeville",
    images: [
      {
        url: "/gallery/salmon_dish.jpg",
        alt: "Blackened salmon entree at Fozzie's Dining in Cookeville, TN",
      },
    ],
  },
  twitter: {
    title: "Best Fine Dining in Cookeville, TN | Fozzie's Dining",
    description:
      "Discover chef-driven fine dining in Cookeville at Fozzie's Dining with seasonal menus, polished service, and an atmosphere made for meaningful evenings.",
    images: ["/gallery/salmon_dish.jpg"],
  },
};

const FAQ = [
  {
    question: "What kind of food does Fozzie's Dining serve?",
    answer:
      "A chef-driven seasonal menu that blends Southern cooking with Cajun, Mediterranean, Asian and Hispanic influences: dishes like Nana's Shrimp & Grits, B & C's Salmon with a hot honey citrus glaze, Thai Curry Crawfish Étouffée and Hallie Kay's Filet Mignon.",
  },
  {
    question: "What are the hours?",
    answer: "Dinner is served Tuesday through Saturday, 5:00–9:00 PM. Happy hour is Tuesday through Saturday, 4:00–6:00 PM.",
  },
  {
    question: "Do I need a reservation?",
    answer:
      "Reservations are recommended, especially on weekends and for special occasions. Send a request through the reservation form on our home page and the team will confirm by email, or call +1 (205) 873-0686.",
  },
  {
    question: "Is there a dress code?",
    answer: "Smart casual. Jackets are welcome but not required.",
  },
  {
    question: "Are there gluten-free options?",
    answer: "Yes. Gluten-free options are available, and many dishes are marked gluten-free on the menu.",
  },
];

export default function BestFineDiningCookevillePage() {
  return (
    <main className="mx-auto max-w-6xl bg-ivory px-4 py-12 sm:px-6 sm:py-16">
      <BreadcrumbJsonLd name="Best Fine Dining in Cookeville, TN" path="/best-fine-dining-cookeville" />

      <section className="mx-auto max-w-4xl text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">Best Fine Dining in Cookeville, TN</h1>
        <p className="mx-auto mt-4 max-w-3xl text-softgray leading-7">
          Fozzie&apos;s Dining brings together refined Southern hospitality, confident technique, and an atmosphere
          designed for evenings that deserve more than ordinary. It&apos;s the restaurant of Chef Jason Head, cooking a
          seasonal menu that draws on Southern, Cajun, Mediterranean, Asian and Hispanic traditions.
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
            src="/gallery/salmon_dish.jpg"
            alt="Blackened salmon with hot honey citrus glaze at Fozzie's Dining"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 896px) 896px, 100vw"
          />
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Chef-Led Cuisine With Seasonal Intention</h2>
        <p className="mt-4 text-softgray leading-7">
          Every menu is built around fresh ingredients and thoughtful balance. From first course to dessert, each dish
          is crafted to feel elegant, generous, and distinctly memorable.
        </p>
        <p className="mt-4 text-softgray leading-7">
          The dinner menu changes with the seasons. To begin, there are Avery&apos;s Fried Pickles with sriracha aioli
          or jalapeño ranch, Waka Waka Shrimp, portobello caps stuffed with spinach, sun-dried tomatoes and goat cheese,
          and lump crab cakes with corn relish. Among the mains are Nana&apos;s Shrimp &amp; Grits over gouda grits,
          B &amp; C&apos;s Salmon with a hot honey citrus glaze and sweet potato hash, a Thai Curry Crawfish
          Étouffée over jasmine rice, and Hallie Kay&apos;s Filet Mignon, a center-cut 8 oz. Certified Angus filet
          with peppercorn cream sauce. Dessert might be a crème brûlée, a brownie sundae with salted caramel ice cream,
          or the season&apos;s bread pudding.
        </p>
        <p className="mt-4 text-softgray leading-7">
          Many dishes are marked gluten-free. See everything on the current{" "}
          <a href="/menu" className={L}>
            dinner menu
          </a>
          .
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">The Chef Behind the Kitchen</h2>
        <p className="mt-4 text-softgray leading-7">
          Chef Jason Head was born and raised in Birmingham, Alabama, earned a degree in Music (Voice) at the
          University of Mississippi, and spent nearly two decades in the securities industry before stepping fully into
          the culinary world. In 2021 he founded GameDay Gourmet, a catering company known for elevated tailgate
          spreads, holiday gatherings and private celebrations. His family has had ties to Cookeville since 2001.
        </p>
        <p className="mt-4 text-softgray leading-7">
          In college, friends called him &ldquo;Fozzie&rdquo; for his bright red beard and his knack for making people
          smile. The name stuck, and so did the idea behind it: food brings people together, and the most meaningful
          memories are made at the table.{" "}
          <a href="/about" className={L}>
            Read more about Chef Jason Head
          </a>
          .
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">An Elevated Atmosphere for Real Connection</h2>
        <p className="mt-4 text-softgray leading-7">
          Warm lighting, unhurried pacing, and attentive service set the tone for date nights, celebrations, and
          important dinners where every detail matters.
        </p>
        <p className="mt-4 text-softgray leading-7">
          Tables are set with white tablecloths and candlelight, and the bar pours craft cocktails. The dress code is
          smart casual: jackets are welcome but not required.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Hours, Happy Hour and Reservations</h2>
        <p className="mt-4 text-softgray leading-7">
          Dinner is served Tuesday through Saturday from 5:00 to 9:00 PM. Happy hour runs Tuesday through Saturday
          from 4:00 to 6:00 PM, an easy way to start the evening at the bar before dinner.
        </p>
        <p className="mt-4 text-softgray leading-7">
          Reservations are recommended, especially on weekends and for special occasions. The{" "}
          <a href="/#reserve" className={L}>
            reservation request form
          </a>{" "}
          asks for your date, time and party size, with room for notes such as allergies, a celebration or a seating
          preference. It goes straight to the team, who confirm by email. You can also call{" "}
          <a href="tel:+12058730686" className={L}>
            +1 (205) 873-0686
          </a>
          . For parties of 10 or more, please call or email.
        </p>
      </section>

      <LandingFaq heading="Fine Dining at Fozzie's: Common Questions" items={FAQ} />

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Plan Your Evening at Fozzie&apos;s</h2>
        <p className="mt-4 text-softgray leading-7">
          For private requests, special accommodations, or personalized dining questions, connect through our{" "}
          <a href="/contact" className={L}>
            contact page
          </a>
          .
        </p>
        <p className="mt-4 text-softgray leading-7">
          Ready now?{" "}
          <a href="/#reserve" className={L}>
            Reserve a table at Fozzie&apos;s
          </a>
          .
        </p>
        <p className="mt-4 text-softgray leading-7">
          Celebrating something special? Plan a{" "}
          <a href="/romantic-dinner-cookeville" className={L}>
            romantic dinner in Cookeville
          </a>{" "}
          or host a group with{" "}
          <a href="/private-dining-cookeville" className={L}>
            private dining
          </a>
          .
        </p>
      </section>
    </main>
  );
}
