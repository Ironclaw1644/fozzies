import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Dining in Cookeville, TN",
  description:
    "Host private dining in Cookeville at Fozzie's Dining for celebrations, client dinners, and milestone gatherings with elevated cuisine and personalized hospitality.",
  alternates: {
    canonical: "/private-dining-cookeville",
  },
  openGraph: {
    title: "Private Dining in Cookeville, TN | Fozzie's Dining",
    description:
      "Host private dining in Cookeville at Fozzie's Dining for celebrations, client dinners, and milestone gatherings with elevated cuisine and personalized hospitality.",
    url: "/private-dining-cookeville",
    images: [
      {
        url: "/gallery/dining_room_1.png",
        alt: "Private dining room at Fozzie's Dining in Cookeville, TN",
      },
    ],
  },
  twitter: {
    title: "Private Dining in Cookeville, TN | Fozzie's Dining",
    description:
      "Host private dining in Cookeville at Fozzie's Dining for celebrations, client dinners, and milestone gatherings with elevated cuisine and personalized hospitality.",
    images: ["/gallery/dining_room_1.png"],
  },
};

export default function PrivateDiningCookevillePage() {
  return (
    <main className="mx-auto max-w-6xl bg-ivory px-4 py-12 sm:px-6 sm:py-16">
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
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Customized Menus and Service</h2>
        <p className="mt-4 text-softgray leading-7">
          Chef-led planning allows each event to reflect your occasion. Review style and seasonal direction on our{" "}
          <a href="/menu" className="underline decoration-gold/70 underline-offset-4 hover:text-charcoal">menu</a>.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Plan Your Private Dining Experience</h2>
        <p className="mt-4 text-softgray leading-7">
          For availability, group details, and special requests, start with our{" "}
          <a href="/contact" className="underline decoration-gold/70 underline-offset-4 hover:text-charcoal">contact page</a>.
        </p>
        <p className="mt-4 text-softgray leading-7">
          Ready to book now?{" "}
          <a href="/#reserve" className="underline decoration-gold/70 underline-offset-4 hover:text-charcoal">
            Reserve a table at Fozzie&apos;s
          </a>
          .
        </p>
        <p className="mt-4 text-softgray leading-7">
          Hosting just the two of you? Plan a{" "}
          <a href="/romantic-dinner-cookeville" className="underline decoration-gold/70 underline-offset-4 hover:text-charcoal">
            romantic dinner in Cookeville
          </a>{" "}
          or start with the{" "}
          <a href="/best-fine-dining-cookeville" className="underline decoration-gold/70 underline-offset-4 hover:text-charcoal">
            best fine dining in Cookeville
          </a>
          .
        </p>
      </section>
    </main>
  );
}
