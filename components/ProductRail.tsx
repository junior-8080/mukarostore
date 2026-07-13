"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useShopProducts } from "@/lib/hooks/use-shop";

export default function ProductRail() {
  const { data: products = [], isLoading } = useShopProducts("all");

  const featured = products.slice(0, 6);

  if (!isLoading && featured.length === 0) return null;

  return (
    <section id="shop-preview" className="pt-16 pb-10">
      <div className="text-center mb-9 px-6">
        <h2 className="font-serif italic text-3xl sm:text-4xl text-brand-black">
          This Season&apos;s Muse
        </h2>
        <p className="text-[13px] text-brand-black/50 mt-1.5">
          Ready-to-wear pieces, made to turn heads and hold their shape
        </p>
      </div>

      <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 lg:px-12 pb-3">
        <div className="flex gap-5 w-max mx-auto">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-none w-[240px] sm:w-[260px] snap-start">
                <div className="w-full h-[340px] rounded bg-brand-ivory-dark animate-pulse" />
                <div className="h-3.5 w-3/4 rounded-full bg-brand-ivory-dark animate-pulse mt-3" />
                <div className="h-3 w-1/3 rounded-full bg-brand-ivory-dark animate-pulse mt-2" />
              </div>
            ))
          : featured.map((product) => (
              <Link
                key={product._id}
                href={`/shop/${product._id}`}
                className="flex-none w-[240px] sm:w-[260px] snap-start group"
              >
                <div className="relative w-full h-[340px] rounded overflow-hidden bg-brand-ivory">
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="260px"
                    />
                  )}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-brand-black text-brand-gold text-[10px] font-bold uppercase tracking-[1px] px-3 py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[13px] font-semibold tracking-[0.3px] text-brand-black">
                  {product.name}
                </p>
                <p className="text-[13px] font-semibold text-brand-gold-dark mt-1">
                  GH₵{product.price.toLocaleString()}
                </p>
              </Link>
            ))}
        </div>
      </div>

      <div className="text-center mt-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.5px] text-brand-gold-dark hover:text-brand-gold transition-colors"
        >
          View the full collection <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}