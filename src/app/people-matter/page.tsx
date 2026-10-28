import Image from "next/image";
import type { Metadata } from "next";
import { BuyBookButton } from "@/components/BuyBookButton";
import { BreadcrumbJsonLd, LANDING_LINK_CLASS as L, LandingFaq } from "@/components/landing/LandingFaq";
import { BOOK, BOOK_FACT_LINE, BOOK_FAQ, bookJsonLd } from "@/lib/book";

const DESCRIPTION =
  "People Matter is the memoir of Jason Head, chef-owner of Fozzie's Dining in Cookeville, TN: love, loss, prison and redemption. Paperback, hardcover, Kindle.";

export const metadata: Metadata = {
  title: "People Matter: A Memoir by Jason Head",
  description: DESCRIPTION,
  alternates: {
    canonical: BOOK.path,
  },
  openGraph: {
    type: "book",
    title: "People Matter: A Memoir of Love, Loss, Redemption, and Leadership by Jason Head",
    description: DESCRIPTION,
    url: BOOK.path,
    images: [{ url: BOOK.cover, width: 1000, height: 1499, alt: "Cover of People Matter by Jason Head" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "People Matter: A Memoir by Jason Head",
    description: DESCRIPTION,
    images: [BOOK.cover],
  },
};

const PRIMARY_BTN =
  "inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal no-underline transition hover:opacity-90";
const SECONDARY_BTN =
  "inline-flex items-center justify-center rounded-full border border-gold px-5 py-2.5 text-sm font-medium text-charcoal no-underline transition hover:bg-gold/15";

function BuyButtons({ placement }: { placement: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      {BOOK.formats.map((f, i) => (
        <BuyBookButton
          key={f.key}
          href={f.url}
          format={f.key}
          placement={placement}
          className={i === 0 ? PRIMARY_BTN : SECONDARY_BTN}
        >
          {f.label} · ${f.price}
        </BuyBookButton>
      ))}
    </div>
  );
}

export default function PeopleMatterPage() {
  return (
    <main className="mx-auto max-w-6xl bg-ivory px-4 py-12 sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd()) }} />
      <BreadcrumbJsonLd name="People Matter by Jason Head" path={BOOK.path} />

      <section className="grid items-center gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="relative mx-auto aspect-[1000/1499] w-full max-w-[220px] shadow-xl sm:max-w-sm">
            <Image
              src={BOOK.cover}
              alt="Cover of People Matter: A Memoir of Love, Loss, Redemption, and Leadership by Jason Head"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 384px, 90vw"
            />
          </div>
        </div>

        <div className="md:col-span-7">
          <p className="text-[11px] tracking-[0.18em] text-softgray">A MEMOIR BY CHEF JASON HEAD</p>
          <h1 className="mt-3 font-serif text-4xl text-charcoal sm:text-5xl">People Matter</h1>
          <p className="mt-2 font-serif text-xl text-charcoal/80 sm:text-2xl">{BOOK.subtitle}</p>
          <div className="mt-6 h-px w-24 bg-warmgold"></div>
          <p className="mt-6 leading-7 text-softgray">{BOOK_FACT_LINE}</p>
          <div className="mt-8">
            <BuyButtons placement="hero" />
            <p className="mt-3 text-xs text-softgray">Available on Amazon.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">
          What happens when the life you spent decades building disappears almost overnight?
        </h2>
        <div className="mt-5 space-y-5 leading-8 text-charcoal">
          <p>
            For years, Jason Head believed he knew what mattered. He had a family, a career, a home, and a future he
            could picture clearly. He was a husband and father, a successful financial advisor, and a man who believed
            he was building a life that would last.
          </p>
          <p>
            Then everything changed. A series of choices, lies, and consequences shattered the life Jason thought he
            knew. What followed was not simply a criminal conviction or time behind bars. It was the loss of his
            marriage, his freedom, his identity, and the future he had imagined for himself and his children.
          </p>
          <p>
            But prison wasn&apos;t the end of his story. In the quiet and loneliness of confinement, Jason was forced to
            confront the parts of himself he had spent years avoiding. He discovered that regret can be heavier than
            any sentence, and that redemption doesn&apos;t begin when someone else forgives you. It begins when you
            finally tell yourself the truth.
          </p>
          <p>
            <em>People Matter</em> is a raw and deeply personal memoir about failure, shame, love, fatherhood, faith,
            forgiveness, and the long road back from losing almost everything. It is a story about the people who
            stayed when they had every reason to walk away, the people who opened their homes and offered friendship
            when Jason had little left to give, and who reminded him that a person&apos;s worst decision does not have
            to become the definition of his entire life.
          </p>
          <p className="font-serif text-xl text-charcoal sm:text-2xl">
            Because when everything else is stripped away, people matter.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-3xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">From the Author to the Kitchen</h2>
        <p className="mt-4 leading-7 text-softgray">
          Jason Head is the chef and owner of Fozzie&apos;s Dining in Cookeville, Tennessee. Born and raised in
          Birmingham, Alabama, he spent nearly two decades in the securities industry before founding the catering
          company GameDay Gourmet in 2021, and then opening Fozzie&apos;s. His philosophy in the kitchen is the same
          one that gives the book its title: food brings people together, and the most meaningful memories are made
          at the table.
        </p>
        <p className="mt-4 leading-7 text-softgray">
          Read more{" "}
          <a href="/about" className={L}>
            about Chef Jason Head
          </a>
          , see what he&apos;s cooking on the{" "}
          <a href="/menu" className={L}>
            Fozzie&apos;s dinner menu
          </a>
          , or{" "}
          <a href="/#reserve" className={L}>
            reserve a table
          </a>{" "}
          and meet him in person.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-3xl border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Book Details</h2>
        <dl className="mt-5 grid grid-cols-[auto,1fr] gap-x-6 gap-y-2 text-sm">
          <dt className="text-softgray">Author</dt>
          <dd className="text-charcoal">{BOOK.author}</dd>
          <dt className="text-softgray">Published</dt>
          <dd className="text-charcoal">
            {BOOK.datePublishedDisplay} ({BOOK.publisher.toLowerCase()})
          </dd>
          <dt className="text-softgray">Formats</dt>
          <dd className="text-charcoal">Paperback (large print, {BOOK.pages} pages), hardcover, Kindle</dd>
          <dt className="text-softgray">ISBN-13 (paperback)</dt>
          <dd className="text-charcoal">979-8192638293</dd>
          <dt className="text-softgray">Language</dt>
          <dd className="text-charcoal">{BOOK.language}</dd>
        </dl>
        <div className="mt-8">
          <BuyButtons placement="details" />
        </div>
      </section>

      <LandingFaq heading="People Matter: Common Questions" items={BOOK_FAQ} />
    </main>
  );
}
