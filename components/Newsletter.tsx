"use client";

import { useState, FormEvent } from "react";

export default function Newsletter() {
  const [phone, setPhone] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSubscribed(true);
  };

  return (
    <section className="bg-brand-navy py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-heading font-bold text-3xl text-white">
          Stay in the loop
        </h2>
        <p className="text-gray-400 font-body mt-3 text-base">
          Get restocking alerts, bundle drops, and promo codes.
        </p>

        {subscribed ? (
          <p className="mt-8 text-brand-gold font-heading font-bold text-lg">
            You&apos;re subscribed. Watch your phone.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <input
              type="tel"
              required
              placeholder="0XX XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full max-w-xs px-5 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-gray-500 font-body focus:outline-none focus:border-brand-gold"
            />
            <button
              type="submit"
              className="bg-brand-gold text-brand-navy font-heading font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-gray-600 text-xs font-body mt-4">
          No spam. MoMo-verified alerts only.
        </p>
      </div>
    </section>
  );
}
