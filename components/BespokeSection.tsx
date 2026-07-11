"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { MessageSquareText, Scissors, Check } from "lucide-react";
import RevealSection from "@/components/RevealSection";
import { fadeUp } from "@/lib/animations";

// const WHATSAPP_NUMBER = "233203865161";

const STEPS = [
  { Icon: MessageSquareText, label: "Consult" },
  { Icon: Scissors, label: "Measure" },
  { Icon: Check, label: "Fit & Finish" },
];

const OCCASIONS = [
  "Bridal",
  "Eid / Festive",
  "Special Event",
  "Everyday Bespoke",
];

const inputClasses =
  "w-full px-4 py-3.5 rounded border border-brand-gold/30 bg-brand-black-light text-white text-[13px] placeholder:text-white/40 focus:outline-none focus:border-brand-gold transition-colors";

export default function BespokeSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [date, setDate] = useState("");
  const [vision, setVision] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bespoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, occasion, preferredDate: date, vision }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      setName("");
      setPhone("");
      setOccasion(OCCASIONS[0]);
      setDate("");
      setVision("");
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }

    // WhatsApp handoff — disabled for now; requests are saved to the admin instead.
    // const lines = [
    //   "Hello Sutura by Feesah, I'd like to book a bespoke fitting.",
    //   `Name: ${name}`,
    //   `Phone: ${phone}`,
    //   `Occasion: ${occasion}`,
    //   date ? `Preferred date: ${date}` : "",
    //   vision ? `My vision: ${vision}` : "",
    // ].filter(Boolean);
    // window.open(
    //   `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`,
    //   "_blank"
    // );
  };

  return (
    <section id="bespoke" className="py-20 scroll-mt-24">
      <RevealSection className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-14">
        {/* Copy + steps */}
        <motion.div variants={fadeUp} className="max-w-lg">
          <p className="text-xs font-bold uppercase tracking-[2px] text-brand-gold-dark">
            Bespoke Tailoring
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium leading-[1.2] text-brand-black mt-3.5">
            Book Your Bespoke Fitting
          </h2>
          <p className="text-[15px] leading-[1.75] text-brand-black/70 mt-5">
            Every bespoke piece begins with a one-on-one consultation at our Accra studio.
            Tell us the occasion, and Nafisa&apos;s team will guide you through fabric,
            silhouette and fit — measured and made to move exactly like you.
          </p>

          <div className="flex justify-between gap-4 mt-9">
            {STEPS.map(({ Icon, label }) => (
              <div key={label} className="text-center">
                <div className="w-[52px] h-[52px] rounded-full border border-brand-gold-dark/40 flex items-center justify-center mx-auto">
                  <Icon size={22} className="text-brand-gold-dark" strokeWidth={1.6} />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.4px] text-brand-black mt-3">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          variants={fadeUp}
          className="flex-1 w-full max-w-md bg-brand-black rounded-md p-8 sm:p-10"
        >
          <p className="text-xs font-bold uppercase tracking-[1.5px] text-brand-gold mb-5">
            Request a Fitting
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <input
              type="text"
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
            />
            <input
              type="tel"
              required
              placeholder="Phone / WhatsApp number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClasses}
            />
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className={inputClasses}
            >
              {OCCASIONS.map((o) => (
                <option key={o} value={o}>
                  Occasion — {o}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputClasses} [color-scheme:dark]`}
            />
            <textarea
              rows={3}
              placeholder="Tell us about your vision"
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              className={`${inputClasses} resize-none`}
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-1.5 bg-brand-gold text-brand-black py-3.5 px-7 rounded-full text-xs font-bold uppercase tracking-[0.5px] hover:shadow-brand-glow transition-all duration-200 disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Submit Fitting Request"}
            </button>
            {submitted && (
              <p className="text-xs text-brand-gold text-center mt-1 flex items-center justify-center gap-1.5">
                <Check size={14} />
                Request received — we&apos;ll reach out within a day.
              </p>
            )}
            {error && (
              <p className="text-xs text-red-400 text-center mt-1">{error}</p>
            )}
            {!submitted && !error && (
              <p className="text-[11px] text-white/40 text-center mt-1">
                We reply within a day.
              </p>
            )}
          </form>
        </motion.div>
      </RevealSection>
    </section>
  );
}