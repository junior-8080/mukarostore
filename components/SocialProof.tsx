"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import RevealSection from "@/components/RevealSection";
import { fadeUp } from "@/lib/animations";
import { TESTIMONIALS } from "@/lib/data";

export default function SocialProof() {
  return (
    <section className="pt-5 pb-24">
      <div className="text-center mb-9 px-6">
        <h2 className="font-serif italic text-3xl sm:text-4xl text-brand-black">
          Loved By You
        </h2>
        <p className="text-[13px] text-brand-black/50 mt-1.5">
          Words from the women who wear Sutura with pride
        </p>
      </div>

      <RevealSection className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <motion.div
            key={t.name}
            variants={fadeUp}
            className="bg-white border border-brand-black/10 rounded-md p-7"
          >
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="fill-brand-gold text-brand-gold" />
              ))}
            </div>
            <p className="text-sm leading-[1.6] text-brand-black/80 mt-3.5">
              &ldquo;{t.text}&rdquo;
            </p>
            <p className="text-[13px] font-bold text-brand-black mt-5">{t.name}</p>
            <p className="text-xs text-brand-black/50 mt-0.5">{t.role}</p>
          </motion.div>
        ))}
      </RevealSection>
    </section>
  );
}