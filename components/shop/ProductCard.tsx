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
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-card-hover transition-shadow duration-400 flex flex-col cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-ivory-dark">
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

      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-serif text-sm font-semibold text-brand-black leading-snug">
          {product.name}
        </h3>
        <div className="mt-auto pt-2 flex items-baseline gap-2">
          <span className="font-semibold text-brand-gold-dark text-sm">
            GHS {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-brand-black-light line-through">
              GHS {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}