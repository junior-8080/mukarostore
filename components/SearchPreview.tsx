"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  images: string[];
  isBundle: boolean;
}

interface SearchPreviewProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchPreview({ open, onClose }: SearchPreviewProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Auto-focus when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Debounced search
  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}&limit=6`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    search(val);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    onClose();
  }

  function handleResultClick() {
    onClose();
  }

  const showDropdown = focused && query.length >= 2;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 bg-white w-full shadow-2xl">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Input row */}
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <Search size={18} className="text-gray-muted shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Search products, categories, bundles…"
              className="flex-1 text-brand-navy font-body text-base focus:outline-none placeholder:text-gray-muted bg-transparent"
            />
            {loading && <Loader2 size={16} className="text-gray-muted animate-spin shrink-0" />}
            {query && !loading && (
              <button
                type="button"
                onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
                className="text-gray-muted hover:text-brand-navy transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-gray-muted hover:text-brand-navy transition-colors shrink-0 pl-2 border-l border-gray-card"
            >
              <X size={18} />
            </button>
          </form>
        </div>

        {/* Results dropdown */}
        {showDropdown && (
          <div className="border-t border-gray-card max-w-2xl mx-auto w-full">
            {results.length === 0 && !loading ? (
              <p className="px-6 py-5 text-sm font-body text-gray-muted">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <>
                <ul>
                  {results.map((p) => (
                    <li key={p._id} className="border-b border-gray-card last:border-0">
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-gray-light transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 shrink-0 bg-gray-card overflow-hidden relative">
                          {p.images[0] ? (
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : null}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-medium text-brand-navy text-sm truncate group-hover:text-brand-gold transition-colors">
                            {p.name}
                          </p>
                          <p className="text-[11px] font-body text-gray-muted mt-0.5">
                            {p.category}
                            {p.isBundle && (
                              <span className="ml-2 bg-brand-gold/10 text-brand-gold px-1.5 py-0.5 text-[10px] font-medium">
                                Bundle
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Price */}
                        <p className="font-heading font-bold text-brand-navy text-sm shrink-0">
                          ₵{p.price.toLocaleString()}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* See all link */}
                <div className="px-6 py-3 bg-gray-light">
                  <Link
                    href={`/shop?q=${encodeURIComponent(query)}`}
                    onClick={handleResultClick}
                    className="text-sm font-body text-brand-gold hover:underline underline-offset-4"
                  >
                    See all results for &ldquo;{query}&rdquo; →
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
