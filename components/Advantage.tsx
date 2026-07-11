"use client";

import { motion } from "framer-motion";
import { Truck, Scissors, CreditCard, MapPin } from "lucide-react";
import RevealSection from "@/components/RevealSection";
import { fadeUp } from "@/lib/animations";

const TRUST_ITEMS = [
  {
    Icon: Truck,
    title: "Nationwide Delivery",
    description: "Accra pickup, Ghana-wide shipping",
  },
  {
    Icon: Scissors,
    title: "Made-to-Measure",
    description: "Every bespoke piece fitted to you",
  },
  {
    Icon: CreditCard,
    title: "Secure Payment",
    description: "Mobile money & card checkout",
  },
  {
    Icon: MapPin,
    title: "Crafted in Accra",
    description: "Every stitch made in-house",
  },
];

export default function Advantage() {
  return (
    <section className="border-b border-brand-black/10">
      <RevealSection className="max-w-7xl mx-auto px-6 lg:px-8 py-7 grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
        {TRUST_ITEMS.map(({ Icon, title, description }, i) => (
          <motion.div
            key={title}
            variants={fadeUp}
            custom={i}
            className={`flex items-center gap-3.5 px-2 lg:px-8 ${
              i < TRUST_ITEMS.length - 1 ? "lg:border-r lg:border-brand-black/10" : ""
            }`}
          >
            <Icon size={24} className="text-brand-gold shrink-0" strokeWidth={1.6} />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.5px] text-brand-black">
                {title}
              </p>
              <p className="text-xs text-brand-black/50 mt-1">{description}</p>
            </div>
          </motion.div>
        ))}
      </RevealSection>
    </section>
  );
}