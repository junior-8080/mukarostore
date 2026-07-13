"use client";

import { useMemo, useState } from "react";
import { ShoppingBag, WifiOff, RefreshCw, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductCard from "@/components/shop/ProductCard";
import { useShopProducts, useShopCollections } from "@/lib/hooks/use-shop";

const SORT_OPTIONS = [
  { id: "newest", label: "Date, new to old" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
  { id: "name", label: "Name, A–Z" },
] as const;

type SortId = (typeof SORT_OPTIONS)[number]["id"];

function ProductSkeleton({ index }: { index: number }) {
  return (
    <div className="flex flex-col animate-pulse" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="aspect-[4/5] rounded-sm bg-brand-ivory-dark" />
      <div className="h-3.5 bg-brand-ivory-dark rounded-full w-4/5 mt-4" />
      <div className="h-3 bg-brand-ivory-dark rounded-full w-2/5 mt-2" />
    </div>
  );
}

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<SortId>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: apiCollections = [] } = useShopCollections();
  const { data: products = [], isLoading, isError, refetch } = useShopProducts("all");

  const collections = useMemo(() => {
    const fromApi = apiCollections.filter((c) => c.id !== "all");
    if (fromApi.length > 0) return fromApi;
    const ids = [...new Set(products.flatMap((p) => p.collections))];
    return ids.map((id) => ({
      id,
      label: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " "),
    }));
  }, [apiCollections, products]);

  const bounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const effectiveMax = maxPrice ?? bounds.max;

  const filtered = useMemo(() => {
    const list = products.filter(
      (p) =>
        p.price <= effectiveMax &&
        (selectedCategories.length === 0 ||
          p.collections.some((c) => selectedCategories.includes(c)))
    );
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, effectiveMax, selectedCategories, sort]);

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  return (
    <>
      <Navbar />

      {/* Page title strip */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-28">
        <p className="text-[11px] text-brand-black/50 tracking-[0.5px]">
          <Link href="/" className="hover:text-brand-gold transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          Shop
        </p>
        <h1 className="font-serif italic text-3xl sm:text-[38px] text-brand-black mt-2.5">
          Shop the Collection
        </h1>
      </section>

      {/* Sidebar + grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-20 flex flex-col lg:flex-row gap-9 items-start">
        {/* Mobile filters toggle */}
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className="lg:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.5px] border border-brand-black/20 px-4 py-2.5 rounded-sm"
        >
          <SlidersHorizontal size={14} />
          {filtersOpen ? "Hide Filters" : "Filters"}
        </button>

        <aside
          className={`${filtersOpen ? "block" : "hidden"} lg:block w-full lg:w-[220px] shrink-0`}
        >
          <FilterSidebar
            collections={collections}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            bounds={bounds}
            maxPrice={effectiveMax}
            onMaxPriceChange={setMaxPrice}
          />
        </aside>

        <div className="flex-1 min-w-0 w-full">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-7">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductSkeleton key={i} index={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="py-24 flex flex-col items-center gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-brand-ivory-dark flex items-center justify-center">
                <WifiOff size={28} className="text-brand-black-light" strokeWidth={1.4} />
              </div>
              <div>
                <p className="font-serif text-lg font-semibold text-brand-black mb-1">
                  Couldn&apos;t load products
                </p>
                <p className="text-sm text-brand-black-light">
                  Check your connection and try again.
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:underline"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Results count + sort */}
              <div className="flex items-center justify-between pb-6 border-b border-brand-black/10 mb-8">
                <p className="text-[13px] text-brand-black/70">
                  There {filtered.length === 1 ? "is" : "are"} {filtered.length}{" "}
                  {filtered.length === 1 ? "result" : "results"} in total
                </p>
                <label className="text-[13px] text-brand-black/70 flex items-center gap-2">
                  <span className="hidden sm:inline">Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortId)}
                    className="font-bold text-brand-black bg-transparent focus:outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-7">
                  {filtered.map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
                </div>
              ) : (
                <div className="py-24 flex flex-col items-center gap-5 text-center">
                  <div className="w-16 h-16 rounded-full bg-brand-ivory-dark flex items-center justify-center">
                    <ShoppingBag size={28} className="text-brand-black-light" strokeWidth={1.4} />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-semibold text-brand-black mb-1">
                      {products.length === 0
                        ? "Nothing here yet"
                        : "Nothing matches your filters"}
                    </p>
                    <p className="text-sm text-brand-black-light max-w-xs">
                      {products.length === 0
                        ? "We're adding new pieces soon — check back later."
                        : "Try widening the price range or clearing a category."}
                    </p>
                  </div>
                  {products.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCategories([]);
                        setMaxPrice(null);
                      }}
                      className="text-sm font-semibold text-brand-gold hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="bg-brand-black py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-brand-ivory/60 text-sm uppercase tracking-widest mb-3 font-medium">
            Made-to-Fit
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-ivory mb-4">
            Don&apos;t see your size?
          </h2>
          <p className="text-brand-ivory/70 mb-8 leading-relaxed">
            Every piece can be tailored to your exact measurements. Contact us and
            we&apos;ll craft something just for you.
          </p>
          <Link
            href="/#bespoke"
            className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold px-8 py-3.5 rounded-full shadow-brand-glow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Request Made-to-Fit
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}