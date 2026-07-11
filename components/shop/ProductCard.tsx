"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Shirt } from "lucide-react";
import type { Product } from "@/lib/data";

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-brand-gold text-white",
  "New": "bg-brand-black text-white",
  "Eid Special": "bg-brand-gold-dark text-white",
};

function formatPrice(value: number) {
  return `GH₵${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

interface ProductCardProps {
  product: Product;
  index: number;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, index, onViewDetails }: ProductCardProps) {
  const image = product.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden bg-brand-ivory-dark">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-brand-ivory-dark flex items-center justify-center">
            <Shirt size={36} className="text-brand-black-light opacity-30" strokeWidth={1.2} />
          </div>
        )}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
              BADGE_STYLES[product.badge] ?? "bg-brand-black text-white"
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-[13px] font-bold uppercase tracking-[0.8px] text-brand-black leading-snug">
        {product.name}
      </h3>
      <div className="text-brand-gold text-xs tracking-[2px] mt-1.5" aria-hidden>
        ★★★★★
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-sm font-semibold text-brand-black">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <span className="text-xs text-brand-black-light line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>
    </motion.div>
  );
}