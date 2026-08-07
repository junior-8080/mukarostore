"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryItem } from "@/lib/data";

export default function Hero() {
  const [slides, setSlides] = useState<CategoryItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: CategoryItem[]) => {
        const withImages = data.filter((c) => c.image);
        setSlides(withImages);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (paused || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <section className="min-h-[90vh] bg-brand-navy flex flex-col md:flex-row overflow-hidden">
      {/* ── Left: copy ── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-16 md:py-0 z-10">
        <span className="inline-flex items-center gap-2 text-brand-gold text-xs font-heading font-bold uppercase tracking-widest mb-6">
          <span className="w-6 h-px bg-brand-gold" />
          Ghana&apos;s Home &amp; Office Store
        </span>

        <h1 className="font-heading font-extrabold text-white leading-[1.05] text-5xl sm:text-6xl lg:text-7xl">
          Everything
          <br />
          Your Space
          <br />
          <span className="text-brand-gold">Needs.</span>
        </h1>

        <p className="mt-6 text-white/60 font-body text-base sm:text-lg max-w-sm leading-relaxed">
          Quality home and office essentials delivered same day in Accra,
          nationwide in 2–4 days.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center bg-brand-gold text-brand-navy font-heading font-bold px-7 py-3.5 rounded-xl hover:brightness-105 active:scale-95 transition-all text-sm"
          >
            Shop Now
          </Link>
          <Link
            href="/shop?category=Bundles"
            className="inline-flex items-center border border-white/20 text-white font-heading font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            View Bundles
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mt-14 flex gap-8">
          {[
            { value: "500+", label: "Products" },
            { value: "GHS 200", label: "Free delivery" },
            { value: "Same-day", label: "Accra delivery" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-heading font-bold text-white text-lg">{stat.value}</p>
              <p className="text-white/40 font-body text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: image carousel ── */}
      <div
        className="relative w-full md:w-[48%] lg:w-[52%] min-h-[50vh] md:min-h-full shrink-0 bg-brand-navy/80"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.length === 0 ? (
          /* Placeholder while loading or no categories with images */
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-gold/10 to-brand-navy" />
        ) : (
          <>
            {slides.map((slide, i) => (
              <div
                key={slide._id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.name}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 52vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/60 via-transparent to-transparent md:from-brand-navy/40" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-6 pb-16 pt-12">
                  {slide.description && (
                    <span className="text-white/50 text-[10px] font-body uppercase tracking-widest">
                      {slide.description}
                    </span>
                  )}
                  <p className="font-heading font-bold text-white text-xl mt-1">
                    {slide.name}
                  </p>
                </div>
              </div>
            ))}

            {/* Dot indicators */}
            {slides.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-6 bg-brand-gold"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
