"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  activeCategory: string;
  categories: string[];
};

export default function CategoryFilter({ activeCategory, categories }: Props) {
  const [open, setOpen] = useState(false);

  const all = ["All Products", ...categories];
  const activeLabel = activeCategory || "All Products";

  return (
    <aside className="w-full lg:w-56 shrink-0 lg:sticky lg:top-20 lg:self-start">
      {/* ── Mobile: collapsed pill with toggle ── */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-card text-sm font-body"
        >
          <span>
            <span className="text-gray-muted">Category: </span>
            <span className="font-semibold text-brand-navy">{activeLabel}</span>
          </span>
          {open ? (
            <ChevronUp size={16} className="text-gray-muted" />
          ) : (
            <ChevronDown size={16} className="text-gray-muted" />
          )}
        </button>

        {open && (
          <ul className="bg-white border-x border-b border-gray-card divide-y divide-gray-card">
            {all.map((cat) => {
              const isActive =
                (cat === "All Products" && !activeCategory) || cat === activeCategory;
              return (
                <li key={cat}>
                  <Link
                    href={cat === "All Products" ? "/shop" : `/shop?category=${cat}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 text-sm font-body transition-colors ${
                      isActive
                        ? "text-brand-gold font-semibold bg-brand-gold/5"
                        : "text-brand-navy hover:bg-gray-light"
                    }`}
                  >
                    {cat}
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Desktop: sticky flat list ── */}
      <div className="hidden lg:block bg-white border border-gray-card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-card">
          <p className="text-[10px] text-gray-muted font-body uppercase tracking-widest">
            Categories
          </p>
        </div>
        <ul>
          {all.map((cat) => {
            const isActive =
              (cat === "All Products" && !activeCategory) || cat === activeCategory;
            return (
              <li key={cat}>
                <Link
                  href={cat === "All Products" ? "/shop" : `/shop?category=${cat}`}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm font-body transition-colors border-b border-gray-card last:border-0 ${
                    isActive
                      ? "text-brand-gold font-semibold bg-brand-gold/5"
                      : "text-brand-navy hover:bg-gray-light"
                  }`}
                >
                  {cat}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
