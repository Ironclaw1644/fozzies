import Image from "next/image";
import type { Metadata } from "next";
import { getDefaultContactPayload, isAllowedContactHref, parseContactPayload } from "@/lib/contactSettings";
import { GOLD_UNDERLINE_LINK_CLASS } from "@/lib/linkStyles";
import { getSettingValue } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Fozzie's Dining in Cookeville, Tennessee for private dining inquiries, media, and general questions.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Fozzie's Dining",
    description: "Contact Fozzie's Dining in Cookeville, Tennessee for private dining inquiries, media, and general questions.",
    url: "/contact",
    images: [
      {
        url: "/brand/logo_all_1_hq.png",
        alt: "Fozzie's Dining logo",
      },
    ],
  },
  twitter: {
    title: "Contact | Fozzie's Dining",
    description: "Contact Fozzie's Dining in Cookeville, Tennessee for private dining inquiries, media, and general questions.",
    images: ["/brand/logo_all_1_hq.png"],
  },
};

export default async function ContactPage() {
  const defaults = getDefaultContactPayload();
  let contactPayload = defaults;
  const storedContact = await getSettingValue<unknown>("contact_page");
  if (storedContact) {
    const parsed = parseContactPayload(storedContact);
    if (parsed) contactPayload = parsed;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl text-charcoal">{contactPayload.title}</h1>
      {contactPayload.subtitle ? <p className="mt-3 max-w-2xl text-softgray">{contactPayload.subtitle}</p> : null}
      <div className="mt-6 h-px w-24 bg-warmgold" />

      <div className="mt-10 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-6">
          <section className="border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-2xl text-charcoal">Reach Us</h2>
            <div className="mt-4 space-y-3 text-softgray">
              {contactPayload.blocks.map((block) => (
                <p key={block.id}>
                  {block.label}:{" "}
                  {isAllowedContactHref(block.href) ? (
                    <a href={block.href} className={GOLD_UNDERLINE_LINK_CLASS}>
                      {block.value}
                    </a>
                  ) : (
                    <span>{block.value}</span>
                  )}
                </p>
              ))}
            </div>
            {contactPayload.note ? <p className="mt-5 text-sm leading-6 text-softgray">{contactPayload.note}</p> : null}
          </section>

          <section className="mt-6 border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-2xl text-charcoal">Hours</h2>
            <div className="mt-4 space-y-2 text-softgray">
              <p>Dinner: Tuesday–Saturday, 5:00–9:00 PM</p>
              <p>Happy Hour: Tuesday–Saturday, 4:00–6:00 PM</p>
              <p>Cookeville, Tennessee</p>
            </div>
            <a
              href="/#reserve"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal no-underline transition hover:opacity-90"
            >
              Reserve a Table
            </a>
          </section>
        </div>

        <div className="md:col-span-6">
          <div className="overflow-hidden border border-charcoal/10 bg-cream shadow-sm">
            <div className="relative aspect-[4/5] w-full md:h-full md:aspect-auto md:min-h-[420px]">
              <Image
                src="/gallery/bar_lounge.jpg"
                alt="Craft cocktails at the bar at Fozzie's Dining"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
