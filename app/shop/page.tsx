"use client";

import { useState } from "react";
import { ArrowLeft, ShoppingBag, WifiOff, RefreshCw } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CollectionTabs from "@/components/shop/CollectionTabs";
import ProductCard from "@/components/shop/ProductCard";
import ProductDrawer from "@/components/shop/ProductDrawer";
import { useShopProducts, useShopCollections } from "@/lib/hooks/use-shop";
import type { Product } from "@/lib/data";

function ProductSkeleton({ index }: { index: number }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col animate-pulse"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="aspect-[3/4] bg-brand-ivory-dark" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3.5 bg-brand-ivory-dark rounded-full w-4/5" />
        <div className="h-3 bg-brand-ivory-dark rounded-full w-2/5 mt-1" />
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [activeCollection, setActiveCollection] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: collections = [], isLoading: collectionsLoading } = useShopCollections();
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useShopProducts(activeCollection);

  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-4">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-serif text-2xl font-bold text-brand-black">Shop</h1>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-brand-black-light hover:text-brand-gold transition-colors"
          >
            <ArrowLeft size={12} />
            Home
          </Link>
        </div>

        <CollectionTabs
          collections={collections}
          active={activeCollection}
          onChange={setActiveCollection}
          isLoading={collectionsLoading}
        />
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
        {isLoading ? (
          <>
            <div className="h-3.5 w-16 bg-brand-ivory-dark rounded-full mb-4 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} index={i} />
              ))}
            </div>
          </>
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
        ) : products.length > 0 ? (
          <>
            <p className="text-xs text-brand-black-light mb-4">
              {products.length} {products.length === 1 ? "item" : "items"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={i}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="py-24 flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-ivory-dark flex items-center justify-center">
              <ShoppingBag size={28} className="text-brand-black-light" strokeWidth={1.4} />
            </div>
            <div>
              <p className="font-serif text-lg font-semibold text-brand-black mb-1">
                Nothing here yet
              </p>
              <p className="text-sm text-brand-black-light max-w-xs">
                {activeCollection === "all"
                  ? "We're adding new pieces soon — check back later."
                  : "No items in this collection yet."}
              </p>
            </div>
            {activeCollection !== "all" && (
              <button
                onClick={() => setActiveCollection("all")}
                className="text-sm font-semibold text-brand-gold hover:underline"
              >
                Browse all items
              </button>
            )}
          </div>
        )}
      </section>

      <section className="bg-brand-black py-14 mt-10">
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
            href="/checkout?custom=1"
            className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold px-8 py-3.5 rounded-full shadow-brand-glow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Request Made-to-Fit
          </Link>
        </div>
      </section>

      <Footer />

      <ProductDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}