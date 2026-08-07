"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/data";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { add } = useCart();

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col ${
        product.isBundle ? "border-2 border-brand-gold" : "border border-gray-card"
      }`}
    >
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-card">
        <Image
          src={product.images[0] ?? "https://via.placeholder.com/400x400"}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.isBundle && (
          <span className="absolute top-2 right-2 bg-brand-gold text-brand-navy text-[10px] font-heading font-bold px-2 py-0.5 rounded-full uppercase">
            BUNDLE
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-gray-muted text-xs font-body uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-heading font-semibold text-brand-navy text-sm leading-snug hover:text-brand-gold transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="font-heading font-bold text-brand-navy text-base mt-2">
          GHS {product.price}
        </p>
        <div className="mt-auto pt-3">
          <button
            onClick={() => add(product)}
            className="w-full bg-brand-gold text-brand-navy font-heading font-bold text-sm py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
