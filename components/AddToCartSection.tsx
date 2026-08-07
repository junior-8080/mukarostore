"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/data";

type Props = {
  product: Product;
};

export default function AddToCartSection({ product }: Props) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      add(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Quantity stepper */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-body text-gray-muted">Qty:</span>
        <div className="flex items-center border border-gray-card rounded-lg overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-brand-navy font-heading font-bold hover:bg-gray-light transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-4 py-2 font-heading font-bold text-brand-navy min-w-[3rem] text-center">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-2 text-brand-navy font-heading font-bold hover:bg-gray-light transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAdd}
          className="flex-1 bg-brand-gold text-brand-navy font-heading font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          {added ? "Added!" : "Add to Cart"}
        </button>
        <button
          onClick={() => {
            for (let i = 0; i < qty; i++) add(product);
            window.location.href = "/cart";
          }}
          className="flex-1 border-2 border-brand-navy text-brand-navy font-heading font-bold py-3 rounded-lg hover:bg-brand-navy hover:text-white transition-colors"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
