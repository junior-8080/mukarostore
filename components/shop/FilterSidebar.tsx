"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { ShopCollection } from "@/lib/hooks/use-shop";

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-brand-black/10 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between"
      >
        <span className="text-sm font-bold text-brand-black">{title}</span>
        {open ? (
          <Minus size={16} className="text-brand-black/40" />
        ) : (
          <Plus size={16} className="text-brand-black/40" />
        )}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

interface FilterSidebarProps {
  collections: ShopCollection[];
  selectedCategories: string[];
  onToggleCategory: (id: string) => void;
  bounds: { min: number; max: number };
  maxPrice: number;
  onMaxPriceChange: (value: number) => void;
}

export default function FilterSidebar({
  collections,
  selectedCategories,
  onToggleCategory,
  bounds,
  maxPrice,
  onMaxPriceChange,
}: FilterSidebarProps) {
  return (
    <div>
      <Section title="Price">
        <div className="flex items-center gap-2.5">
          <div className="w-full px-3 py-2.5 border border-brand-black/20 rounded-sm text-[13px] text-brand-black">
            GH₵{bounds.min.toLocaleString()}
          </div>
          <span className="text-brand-black/40">—</span>
          <div className="w-full px-3 py-2.5 border border-brand-black/20 rounded-sm text-[13px] text-brand-black">
            GH₵{maxPrice.toLocaleString()}
          </div>
        </div>
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={50}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full mt-4 accent-brand-black"
        />
        <p className="text-xs text-brand-black/70 mt-2.5">
          Price:{" "}
          <strong>
            GH₵{bounds.min.toLocaleString()} — GH₵{maxPrice.toLocaleString()}
          </strong>
        </p>
      </Section>

      {collections.length > 0 && (
        <Section title="Product Category">
          <div className="flex flex-col gap-3.5 text-[13px]">
            {collections.map((col) => (
              <label
                key={col.id}
                className="flex items-center gap-2.5 cursor-pointer text-brand-black"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(col.id)}
                  onChange={() => onToggleCategory(col.id)}
                  className="accent-brand-black w-3.5 h-3.5"
                />
                {col.label}
              </label>
            ))}
          </div>
        </Section>
      )}

    </div>
  );
}