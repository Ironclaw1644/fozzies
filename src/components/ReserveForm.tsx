"use client";

import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { track } from "@/lib/trackClient";

type FormState = "idle" | "submitting" | "success" | "error";

// Fozzie's hasn't opened yet. Flip to false on opening day to drop the notice and restore the booking copy.
const GRAND_OPENING_SOON = true;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function ReserveForm() {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }, []);

  const [date, setDate] = useState(today);
  const [time, setTime] = useState("19:00");
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date,
          time,
          partySize,
          notes,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Could not submit reservation.");
      }

      trackEvent("reservation_submit", {
        page_path: "/",
      });
      track("reservation_submit", {
        page_path: "/",
        meta: { party_size: partySize },
      });
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not submit reservation.");
    }
  }

  return (
    <div className="border border-charcoal/10 bg-cream shadow-sm">
      <div className="px-6 py-6 sm:px-8">
        {GRAND_OPENING_SOON ? (
          <div
            role="note"
            className="mx-auto mb-8 max-w-2xl border border-gold/60 bg-ivory px-6 py-5 text-center"
          >
            <div className="inline-flex items-center gap-3 whitespace-nowrap text-[11px] font-semibold tracking-[0.22em] text-[#83672A] sm:text-xs">
              <span className="h-px w-8 bg-gold/70" />
              GRAND OPENING
              <span className="h-px w-8 bg-gold/70" />
            </div>
            <p className="mt-2 font-serif text-2xl italic text-charcoal">Coming Soon</p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-softgray">
              We’re putting the finishing touches on Fozzie’s. Send us a request below and we’ll be in
              touch as soon as reservations open.
            </p>
          </div>
        ) : null}

        <div className="text-center">
          <div className="inline-flex items-center gap-3 whitespace-nowrap text-[11px] tracking-[0.18em] sm:text-xs sm:tracking-[0.22em] text-softgray">
            <span className="h-px w-10 bg-gold/70" />
            RESERVE
            <span className="h-px w-10 bg-gold/70" />
          </div>
          <h2 className="mt-4 font-serif text-3xl text-charcoal">Request a table</h2>
          <p className="mx-auto mt-3 max-w-2xl text-softgray">
            {GRAND_OPENING_SOON
              ? "This sends a request directly to the team. We’ll reach out by email once we open."
              : "This sends a request directly to the team. We’ll confirm by email."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="text-xs tracking-[0.18em] text-softgray">NAME</div>
              <input
                className="mt-2 w-full border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal outline-none focus:border-gold/70"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <div className="text-xs tracking-[0.18em] text-softgray">EMAIL</div>
              <input
                type="email"
                className="mt-2 w-full border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal outline-none focus:border-gold/70"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <div className="text-xs tracking-[0.18em] text-softgray">PHONE</div>
              <input
                className="mt-2 w-full border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal outline-none focus:border-gold/70"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
              />
            </label>

            <label className="block">
              <div className="text-xs tracking-[0.18em] text-softgray">PARTY SIZE</div>
              <select
                className="mt-2 w-full border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal outline-none focus:border-gold/70"
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <div className="text-xs tracking-[0.18em] text-softgray">DATE</div>
              <input
                type="date"
                className="mt-2 w-full border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal outline-none focus:border-gold/70"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <div className="text-xs tracking-[0.18em] text-softgray">TIME</div>
              <input
                type="time"
                className="mt-2 w-full border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal outline-none focus:border-gold/70"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="mt-4 block">
            <div className="text-xs tracking-[0.18em] text-softgray">NOTES</div>
            <textarea
              className="mt-2 w-full border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal outline-none focus:border-gold/70"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, celebrations, seating preferences…"
            />
          </label>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={status === "submitting" || status === "success"}
              className="w-full sm:w-auto rounded-full bg-gold px-6 py-3 text-sm font-semibold text-charcoal transition hover:opacity-90 disabled:opacity-60"
            >
              {status === "submitting" ? "Sending..." : status === "success" ? "Request Sent" : "Send Request"}
            </button>

            <div className="text-xs text-softgray">
              {status === "success" ? (
                <span className="text-charcoal/80">
                  {GRAND_OPENING_SOON
                    ? "Thank you — we’ll be in touch as soon as we open."
                    : "Thank you — we’ll confirm by email shortly."}
                </span>
              ) : status === "error" ? (
                <span className="text-red-700">{error}</span>
              ) : (
                <>
                  <span>
                    {GRAND_OPENING_SOON ? "Questions? Give us a call:" : "Prefer the phone? Call us for immediate booking:"}
                  </span>{" "}
                  <a
                    href="tel:+12058730686"
                    className="mt-2 inline-flex min-h-10 items-center py-1 font-medium text-[#83672A] no-underline transition hover:underline hover:underline-offset-4"
                  >
                    +1 (205) 873-0686
                  </a>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
