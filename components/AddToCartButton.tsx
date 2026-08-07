"use client";

import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/data";

type Props = {
  product: Product;
  className?: string;
  label?: string;
};

export default function AddToCartButton({
  product,
  className,
  label = "Add to Cart",
}: Props) {
  const { add } = useCart();

  return (
    <button
      onClick={() => add(product)}
      className={
        className ??
        "w-full bg-brand-gold text-brand-navy font-heading font-bold py-2 rounded-lg hover:opacity-90 transition-opacity"
      }
    >
      {label}
    </button>
  );
}
