"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-card hover:shadow-md transition-shadow"
    >
      <div className="relative w-full aspect-square overflow-hidden bg-gray-card">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-card flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
        )}
        {product.isBundle && (
          <span className="absolute top-2 right-2 bg-brand-gold text-brand-navy text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            BUNDLE
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-gray-muted text-xs uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-heading font-semibold text-brand-navy text-sm leading-snug">
          {product.name}
        </h3>
        <p className="font-heading font-bold text-brand-navy mt-2">
          GHS {product.price}
        </p>
      </div>
    </Link>
  );
}
