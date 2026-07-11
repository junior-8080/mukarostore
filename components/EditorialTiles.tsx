"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import RevealSection from "@/components/RevealSection";
import { fadeUp } from "@/lib/animations";

const TILES = [
  {
    eyebrow: "Bridal & Special Occasion",
    title: "Aisle-ready elegance",
    image: "/landingPage/img04.JPG",
    href: "/shop",
  },
  {
    eyebrow: "Ready-to-Wear",
    title: "Everyday, elevated",
    image: "/landingPage/img05.JPG",
    href: "/shop",
  },
  {
    eyebrow: "Eid Collection",
    title: "Festive, in full colour",
    image: "/landingPage/img06.jpeg",
    href: "/shop",
  },
];

export default function EditorialTiles() {
  return (
    <section className="pb-20">
      <RevealSection className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        {TILES.map((tile) => (
          <motion.div key={tile.title} variants={fadeUp}>
            <Link
              href={tile.href}
              className="relative block h-[420px] lg:h-[520px] rounded overflow-hidden group"
            >
              <Image
                src={tile.image}
                alt={tile.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-black/70 pointer-events-none" />
              <div className="absolute left-6 right-6 bottom-6 text-white">
                <p className="text-[11px] uppercase tracking-[2px] text-brand-gold">
                  {tile.eyebrow}
                </p>
                <p className="font-serif italic text-2xl mt-1.5">{tile.title}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </RevealSection>
    </section>
  );
}