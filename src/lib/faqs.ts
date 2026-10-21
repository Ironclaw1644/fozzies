import type { LandingFaqItem } from "@/components/landing/LandingFaq";

// The visible FAQs on About and the landing pages, kept here so /llms.txt can
// quote them word for word. `dishes` lists every dish an answer names: /llms.txt
// drops the answer once any of them leaves the live admin menu.
export type FaqEntry = LandingFaqItem & { dishes?: string[] };

export const ABOUT_FAQ: FaqEntry[] = [
  {
    question: "Who owns Fozzie's Dining?",
    answer:
      "Chef Jason Head is the chef and owner of Fozzie's Dining in Cookeville, Tennessee. He was born and raised in Birmingham, Alabama, and in 2021 founded GameDay Gourmet, a catering company.",
  },
  {
    question: "Why is it called Fozzie's?",
    answer:
      "In college, friends called Jason \u201cFozzie\u201d for his bright red beard and his knack for making people smile. The name stuck.",
  },
  {
    question: "Is Fozzie's Dining the same as Fozzie's Sandwich Emporium or Fozzy's Bar & Grill?",
    answer:
      "No. Fozzie's Dining is Chef Jason Head's restaurant in Cookeville, Tennessee. Fozzie's Sandwich Emporium in Missouri and Fozzy's Bar & Grill in Franklin and Spring Hill, Tennessee, are separate restaurants.",
  },
  {
    question: "What kind of food does Chef Jason cook?",
    answer:
      "A seasonal menu that blends classic Southern cooking with Cajun, Mediterranean, Asian and Hispanic influences, from Nana's Shrimp & Grits to a Thai Curry Crawfish Étouffée.",
    dishes: ["Nana's Shrimp & Grits", "Thai Curry Crawfish Étouffée"],
  },
];

export const FINE_DINING_FAQ: FaqEntry[] = [
  {
    question: "What kind of food does Fozzie's Dining serve?",
    answer:
      "A chef-driven seasonal menu that blends Southern cooking with Cajun, Mediterranean, Asian and Hispanic influences: dishes like Nana's Shrimp & Grits, B & C's Salmon with a hot honey citrus glaze, Thai Curry Crawfish Étouffée and Hallie Kay's Filet Mignon.",
    dishes: ["Nana's Shrimp & Grits", "B & C's Salmon", "Thai Curry Crawfish Étouffée", "Hallie Kay's Filet Mignon"],
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
  {
    question: "Where is Fozzie's Dining?",
    answer:
      "Fozzie's Dining is in Cookeville, Tennessee. For directions or questions before your visit, call +1 (205) 873-0686 or email fozziesdining@gmail.com.",
  },
  {
    question: "Who is the chef at Fozzie's Dining?",
    answer:
      "Chef Jason Head, the chef and owner. He was born and raised in Birmingham, Alabama, and in 2021 founded GameDay Gourmet, a catering company.",
  },
];

export const ROMANTIC_DINNER_FAQ: FaqEntry[] = [
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
    question: "Is there a bar for a drink before dinner?",
    answer:
      "Yes. The bar pours craft cocktails, and happy hour runs Tuesday through Saturday, 4:00–6:00 PM, before dinner service starts at 5:00.",
  },
  {
    question: "What desserts are on the menu?",
    answer:
      "Desserts include crème brûlée, a brownie sundae with salted caramel ice cream, Edie's Mousse of the Week and the chef's seasonal bread pudding.",
    dishes: ["Crème Brûlée", "Brownie Sundae", "Edie's Mousse of the Week", "Bread Pudding"],
  },
  {
    question: "Can we note an allergy ahead of time?",
    answer:
      "Yes. The reservation request has a notes field for allergies, celebrations and seating preferences. Gluten-free options are available, and many dishes are marked gluten-free on the menu.",
  },
];

export const PRIVATE_DINING_FAQ: FaqEntry[] = [
  {
    question: "How do I book a dinner for a large group?",
    answer:
      "For parties of 10 or more, please call +1 (205) 873-0686 or email fozziesdining@gmail.com. Smaller groups can use the reservation request form on our home page, and the team will confirm by email.",
  },
  {
    question: "Can Fozzie's Dining host a rehearsal dinner?",
    answer:
      "Rehearsal dinners, business dinners and other celebrations can be arranged. For 10 or more guests, call +1 (205) 873-0686 or email fozziesdining@gmail.com with your date, guest count and any menu requests.",
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
    dishes: ["Crab Cakes", "Waka Waka Shrimp", "Nana's Shrimp & Grits", "Smoky Mountain Surf & Turf", "Hallie Kay's Filet Mignon", "Crème Brûlée"],
  },
  {
    question: "Is there a dress code?",
    answer: "Smart casual. Jackets are welcome but not required.",
  },
];
