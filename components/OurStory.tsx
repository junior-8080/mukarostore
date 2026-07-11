"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import RevealSection from "@/components/RevealSection";
import { fadeUp } from "@/lib/animations";

export default function OurStory() {
  return (
    <section id="story" className="py-20">
      <RevealSection className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-14">
        {/* Overlapping images */}
        <motion.div
          variants={fadeUp}
          className="relative w-full max-w-md lg:w-[46%] h-[420px] sm:h-[480px] shrink-0"
        >
          <div className="absolute right-0 top-10 w-[70%] h-[340px] rounded border-[6px] border-white shadow-[0_20px_40px_rgba(10,10,10,0.25)] overflow-hidden">
            <Image
              src="/landingPage/img01.JPG"
              alt="Inside the Sutura by Feesah atelier"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 70vw, 320px"
            />
          </div>
          <div className="absolute left-0 bottom-0 w-[70%] h-[360px] rounded border-[6px] border-white shadow-[0_20px_40px_rgba(10,10,10,0.25)] overflow-hidden">
            <Image
              src="/landingPage/img02.JPG"
              alt="Nafisa, creative director of Sutura by Feesah"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 70vw, 320px"
            />
          </div>
        </motion.div>

        {/* Copy */}
        <motion.div variants={fadeUp} className="max-w-lg">
          <p className="text-xs font-bold uppercase tracking-[2px] text-brand-gold-dark">
            The Sutura Story
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium leading-[1.2] text-brand-black mt-3.5">
            Founded in Accra. Worn with the Feesaheffect.
          </h2>
          <p className="text-[15px] leading-[1.75] text-brand-black/70 mt-5">
            Sutura by Feesah is an Accra-based womenswear and bridal house founded by
            creative director Nafisa. Every piece — bespoke or ready-to-wear — is built on
            one belief: modest dressing should feel powerful, never small.
          </p>
          <p className="text-[15px] leading-[1.75] text-brand-black/70 mt-3.5">
            From wedding aisles to Eid mornings, our atelier tailors each silhouette by
            hand, pairing rich fabrics with clean, considered cuts. This is the
            Feesaheffect — quiet confidence, unmistakably yours.
          </p>
          <a
            href="https://instagram.com/suturabyfeesah"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-7 bg-brand-black text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.5px] hover:bg-brand-black-light transition-colors"
          >
            <Instagram size={14} />
            Meet Nafisa
          </a>
        </motion.div>
      </RevealSection>
    </section>
  );
}