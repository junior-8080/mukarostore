"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CategoryItem } from "@/lib/data";

const CARD_WIDTH = 220;

interface CategoryGridProps {
  categories: CategoryItem[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "right" ? CARD_WIDTH : -CARD_WIDTH,
      behavior: "smooth",
    });
  }

  const showSlider = categories.length > 4;

  return (
    <section className="bg-gray-light py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading font-bold text-xl text-brand-navy">
              Shop by Category
            </h2>
            <p className="text-gray-muted font-body mt-1">
              Everything your home and office needs, sorted.
            </p>
          </div>

          {showSlider && (
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="w-9 h-9 rounded-full border border-gray-card bg-white flex items-center justify-center text-brand-navy hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="w-9 h-9 rounded-full border border-gray-card bg-white flex items-center justify-center text-brand-navy hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        <div
          ref={scrollRef}
          className={
            showSlider
              ? "flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          }
        >
          {categories.map((cat) => {
            const isBundle = cat.name === "Bundles";
            return (
              <Link
                key={cat._id}
                href={`/shop?category=${cat.name}`}
                className={`group relative shrink-0 overflow-hidden ${
                  showSlider ? "w-[200px] sm:w-[220px]" : ""
                } ${isBundle ? "ring-2 ring-brand-gold" : ""}`}
                style={{ aspectRatio: "3/4" }}
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="220px"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-card" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {isBundle && (
                  <div className="absolute inset-0 bg-brand-gold/10 group-hover:bg-brand-gold/20 transition-colors duration-300" />
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {isBundle && (
                    <span className="inline-block bg-brand-gold text-brand-navy text-[10px] font-heading font-bold px-2 py-0.5 uppercase tracking-wide mb-1.5">
                      BUNDLES
                    </span>
                  )}
                  <p className="font-heading font-bold text-white text-base leading-tight drop-shadow-sm">
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p className="text-white/70 text-xs font-body mt-0.5">
                      {cat.description} →
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
