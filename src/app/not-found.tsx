import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4 py-16 text-center sm:px-6">
      <section className="w-full max-w-2xl border border-charcoal/10 bg-cream p-8 shadow-sm sm:p-12">
        <p className="text-[11px] tracking-[0.18em] text-softgray">PAGE NOT FOUND</p>
        <h1 className="mt-3 font-serif text-4xl text-charcoal">This table isn&apos;t set.</h1>
        <p className="mx-auto mt-4 max-w-md text-softgray">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to something
          delicious.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal no-underline transition hover:opacity-90"
          >
            Back to Home
          </Link>
          <Link
            href="/menu"
            className="rounded-full border border-gold px-5 py-2.5 text-sm font-medium text-charcoal no-underline transition hover:bg-gold/15"
          >
            View the Menu
          </Link>
        </div>
      </section>
    </main>
  );
}
