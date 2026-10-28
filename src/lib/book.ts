import type { LandingFaqItem } from "@/components/landing/LandingFaq";
import { SITE_URL } from "@/lib/siteUrl";

// Chef Jason's memoir. Facts are copied from the Amazon listing (checked
// 2026-10-28), never paraphrased into new claims: the page, the Book JSON-LD and
// /llms.txt all repeat them, so a wrong detail here spreads to search and AI answers.
export const BOOK = {
  title: "People Matter",
  subtitle: "A Memoir of Love, Loss, Redemption, and Leadership",
  fullTitle: "People Matter: A Memoir of Love, Loss, Redemption, and Leadership",
  author: "Jason Head",
  path: "/people-matter",
  cover: "/book/people-matter-cover.jpg",
  publisher: "Independently published",
  datePublished: "2026-08-14",
  datePublishedDisplay: "August 14, 2026",
  pages: 187,
  language: "English",
  genre: "Memoir",
  formats: [
    {
      key: "paperback",
      label: "Paperback",
      price: "14.99",
      url: "https://www.amazon.com/dp/B0HFDKYVB1",
      asin: "B0HFDKYVB1",
      isbn: "9798192638293",
      schemaFormat: "https://schema.org/Paperback",
    },
    {
      key: "hardcover",
      label: "Hardcover",
      price: "19.99",
      url: "https://www.amazon.com/dp/B0HF9V776R",
      asin: "B0HF9V776R",
      schemaFormat: "https://schema.org/Hardcover",
    },
    {
      key: "kindle",
      label: "Kindle",
      price: "7.99",
      url: "https://www.amazon.com/dp/B0HFBGJMQ1",
      asin: "B0HFBGJMQ1",
      schemaFormat: "https://schema.org/EBook",
    },
  ],
} as const;

export const BOOK_URL = `${SITE_URL}${BOOK.path}`;

/** The one quotable sentence about the book. Opens the book page and its /llms.txt section. */
export const BOOK_FACT_LINE =
  "People Matter: A Memoir of Love, Loss, Redemption, and Leadership is the 2026 memoir by Jason Head, chef and owner of Fozzie's Dining in Cookeville, Tennessee, about losing his career, marriage and freedom, his time in prison, and the long road back.";

export const BOOK_FAQ: LandingFaqItem[] = [
  {
    question: "Who wrote People Matter?",
    answer:
      "Jason Head, the chef and owner of Fozzie's Dining in Cookeville, Tennessee. Before he became a chef he spent nearly two decades in the securities industry as a financial advisor.",
  },
  {
    question: "What is People Matter about?",
    answer:
      "It is Jason Head's memoir of losing almost everything: a series of choices, lies and consequences led to a criminal conviction and prison, and with them the loss of his marriage, his freedom and the future he had pictured for his children. It follows what he learned in confinement and the long road back, and the people who stayed.",
  },
  {
    question: "Where can I buy People Matter?",
    answer:
      "On Amazon in paperback ($14.99), hardcover ($19.99) and Kindle ($7.99). The paperback is a large-print edition, 187 pages.",
  },
  {
    question: "When was People Matter published?",
    answer: "August 14, 2026. It is independently published.",
  },
  {
    question: "Is Jason Head the chef at Fozzie's Dining?",
    answer:
      "Yes. Jason Head, nicknamed “Fozzie” in college for his red beard, is the chef and owner of Fozzie's Dining, a chef-driven restaurant in Cookeville, Tennessee.",
  },
];

/** Book node with one Offer per format. The author references the chef Person on /about by @id. */
export function bookJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${BOOK_URL}#book`,
    name: BOOK.fullTitle,
    alternateName: BOOK.title,
    url: BOOK_URL,
    image: `${SITE_URL}${BOOK.cover}`,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/about#chef-jason-head`,
      name: BOOK.author,
      url: `${SITE_URL}/about`,
    },
    publisher: { "@type": "Organization", name: BOOK.publisher },
    datePublished: BOOK.datePublished,
    inLanguage: "en",
    genre: BOOK.genre,
    about: ["Redemption", "Fatherhood", "Forgiveness", "Faith", "Leadership", "Second chances"],
    description: BOOK_FACT_LINE,
    workExample: BOOK.formats.map((f) => ({
      "@type": "Book",
      "@id": `${BOOK_URL}#${f.key}`,
      bookFormat: f.schemaFormat,
      ...("isbn" in f ? { isbn: f.isbn } : {}),
      ...(f.key === "paperback" ? { numberOfPages: BOOK.pages, bookEdition: "Large Print" } : {}),
      potentialAction: {
        "@type": "BuyAction",
        target: f.url,
      },
      offers: {
        "@type": "Offer",
        price: f.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: f.url,
        seller: { "@type": "Organization", name: "Amazon" },
      },
    })),
  };
}
