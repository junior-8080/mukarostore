"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="home" className="relative w-full h-[88vh] min-h-[560px] overflow-hidden bg-brand-black">
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src="/landingPage/banner.JPG"
          alt="Sutura by Feesah — modest elegant wear"
          fill
          className="object-cover object-[center_25%]"
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/20 via-brand-black/10 to-brand-black/70 pointer-events-none" />

      {/* Content */}
      <div className="absolute left-0 right-0 bottom-16 flex flex-col items-center text-center gap-4 px-6 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-brand-white text-xs font-semibold uppercase tracking-[3px]"
        >
          The Feesaheffect
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-brand-white font-bold text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] max-w-3xl text-balance"
        >
          Modesty, tailored to move like confidence
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-wrap justify-center gap-3.5 mt-2 pointer-events-auto"
        >
          <Link
            href="/shop"
            className="bg-brand-gold text-brand-black px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.5px] hover:shadow-brand-glow hover:-translate-y-0.5 transition-all duration-200"
          >
            Shop Ready-to-Wear
          </Link>
          <a
            href="#bespoke"
            className="border border-white text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.5px] hover:bg-white/10 transition-all duration-200"
          >
            Book Bespoke Fitting
          </a>
        </motion.div>
      </div>
    </section>
  );
}