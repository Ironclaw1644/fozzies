import JoinTeamForm from "@/components/JoinTeamForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restaurant Jobs in Cookeville, TN",
  description:
      "Apply to work at Fozzie's Dining, Chef Jason Head's chef-driven restaurant in Cookeville, Tennessee. Fill out the short online application to get started.",
  alternates: {
    canonical: "/join-the-team",
  },
  openGraph: {
    title: "Restaurant Jobs in Cookeville, TN | Fozzie's Dining",
    description:
      "Apply to work at Fozzie's Dining, Chef Jason Head's chef-driven restaurant in Cookeville, Tennessee. Fill out the short online application to get started.",
    url: "/join-the-team",
    images: [
      {
        url: "/brand/logo_all_1_hq.png",
        alt: "Fozzie's Dining logo",
      },
    ],
  },
  twitter: {
    title: "Restaurant Jobs in Cookeville, TN | Fozzie's Dining",
    description:
      "Apply to work at Fozzie's Dining, Chef Jason Head's chef-driven restaurant in Cookeville, Tennessee. Fill out the short online application to get started.",
    images: ["/brand/logo_all_1_hq.png"],
  },
};

export default function JoinTheTeamPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-[11px] tracking-[0.18em] text-softgray">CAREERS</div>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Join The Team</h1>
      <p className="mt-3 max-w-2xl text-softgray">
        We’re always looking for warm hospitality professionals and culinary talent to join Fozzie’s Dining.
      </p>
      <JoinTeamForm />
    </main>
  );
}
