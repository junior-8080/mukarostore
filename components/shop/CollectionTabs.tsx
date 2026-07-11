"use client";

import { motion } from "framer-motion";
import type { ShopCollection } from "@/lib/hooks/use-shop";

interface CollectionTabsProps {
  collections: ShopCollection[];
  active: string;
  onChange: (id: string) => void;
  isLoading?: boolean;
}

export default function CollectionTabs({ collections, active, onChange, isLoading }: CollectionTabsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[72, 56, 88, 64, 76].map((w, i) => (
          <div
            key={i}
            className="shrink-0 h-9 rounded-full bg-brand-ivory-dark animate-pulse"
            style={{ width: w }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {collections.map((col) => (
        <button
          key={col.id}
          onClick={() => onChange(col.id)}
          className={`relative shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            active === col.id
              ? "text-white"
              : "text-brand-black hover:text-brand-gold bg-white border border-brand-ivory-dark"
          }`}
        >
          {active === col.id && (
            <motion.span
              layoutId="collection-pill"
              className="absolute inset-0 rounded-full bg-brand-gradient"
              style={{ zIndex: -1 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
          {col.label}
        </button>
      ))}
    </div>
  );
}