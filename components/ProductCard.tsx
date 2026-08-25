"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import ProductImage from "@/components/ProductImage";
import type { Product } from "@/lib/data";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { add } = useCart();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-gray-light"
      >
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.isBundle && (
          <span className="absolute top-3 left-3 bg-brand-navy text-white text-[10px] font-heading font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Bundle
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1.5">
        <p className="text-gray-muted text-[10px] font-body uppercase tracking-widest">
          {product.category}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-heading font-semibold text-brand-navy text-sm leading-snug hover:text-brand-gold transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price + cart icon */}
        <div className="flex items-center justify-between mt-1">
          <p className="font-heading font-bold text-brand-navy text-base">
            GHS {product.price}
          </p>
          <button
            onClick={() => add(product)}
            aria-label={`Add ${product.name} to cart`}
            className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-brand-navy hover:brightness-105 active:scale-90 transition-all duration-150"
          >
            <ShoppingCart size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
