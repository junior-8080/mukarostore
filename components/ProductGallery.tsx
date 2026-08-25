"use client";

import { useState } from "react";
import ProductImage from "@/components/ProductImage";

type Props = {
  images: string[];
  name: string;
  badge?: string;
};

export default function ProductGallery({ images, name, badge }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-card">
        <ProductImage
          src={images[active]}
          alt={name}
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {badge && (
          <span className="absolute top-4 left-4 bg-brand-gold text-brand-navy text-xs font-heading font-bold px-3 py-1 rounded-full uppercase">
            {badge}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${name}`}
              aria-current={active === i}
              className={`aspect-square rounded-lg bg-gray-card overflow-hidden relative border-2 cursor-pointer transition-colors ${
                active === i ? "border-brand-gold" : "border-transparent hover:border-brand-gold/50"
              }`}
            >
              <ProductImage src={img} alt={`${name} view ${i + 1}`} sizes="10vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
