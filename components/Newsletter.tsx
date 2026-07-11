"use client";

import { useState, FormEvent } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section className="bg-brand-black px-6 py-16 text-center">
      <h2 className="font-serif italic text-2xl sm:text-3xl text-white">
        Join the Feesaheffect
      </h2>
      <p className="text-[13px] text-brand-gold mt-2 max-w-md mx-auto">
        New arrivals, bespoke slots and Eid launches — straight to your inbox.
      </p>

      {subscribed ? (
        <p className="text-sm text-white mt-6">
          You&apos;re on the list — welcome to the Feesaheffect. ✨
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row justify-center items-center gap-2.5 mt-6"
        >
          <input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-[300px] px-5 py-3.5 rounded-full border border-brand-gold/40 bg-white text-brand-black text-[13px] focus:outline-none focus:border-brand-gold"
          />
          <button
            type="submit"
            className="bg-brand-gold text-brand-black px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.5px] hover:shadow-brand-glow transition-all duration-200"
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}