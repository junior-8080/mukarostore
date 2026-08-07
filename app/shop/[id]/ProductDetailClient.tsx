"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBag,
  Check,
  ChevronLeft,
  ChevronRight,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { useShopProduct } from "@/lib/hooks/use-shop";


function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
      <div className="aspect-[4/5] rounded-sm bg-brand-ivory-dark" />
      <div className="flex flex-col gap-5 pt-2">
        <div className="h-7 bg-brand-ivory-dark rounded-full w-3/4" />
        <div className="h-5 bg-brand-ivory-dark rounded-full w-1/3" />
        <div className="h-3.5 bg-brand-ivory-dark rounded-full w-full mt-2" />
        <div className="h-3.5 bg-brand-ivory-dark rounded-full w-5/6" />
        <div className="h-12 bg-brand-ivory-dark rounded-full w-full mt-4" />
        <div className="h-12 bg-brand-ivory-dark rounded-full w-full" />
      </div>
    </div>
  );
}

export default function ProductDetailClient({ id }: { id: string }) {
  const { data: product, isLoading, isError, refetch } = useShopProduct(id);
  const { add, setCartOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent, total: number) {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      setSelectedImg((i) => (delta > 0 ? (i + 1) % total : (i - 1 + total) % total));
    }
    touchStartX.current = null;
  }

  function handleAdd() {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      add(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  }

  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        {/* Breadcrumb */}
        <p className="text-[11px] text-brand-black/50 tracking-[0.5px] mb-8">
          <Link href="/" className="hover:text-brand-gold transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-brand-gold transition-colors">
            Shop
          </Link>
          {product && (
            <>
              <span className="mx-2">/</span>
              {product.name}
            </>
          )}
        </p>

        {isLoading ? (
          <ProductDetailSkeleton />
        ) : isError || !product ? (
          <div className="py-24 flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-ivory-dark flex items-center justify-center">
              <WifiOff size={28} className="text-brand-black-light" strokeWidth={1.4} />
            </div>
            <div>
              <p className="font-serif text-lg font-semibold text-brand-black mb-1">
                Couldn&apos;t load this product
              </p>
              <p className="text-sm text-brand-black-light">
                It may no longer be available, or your connection dropped.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:underline"
              >
                <RefreshCw size={14} />
                Retry
              </button>
              <Link
                href="/shop"
                className="text-sm font-semibold text-brand-black hover:text-brand-gold transition-colors"
              >
                Back to Shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Image gallery */}
            <div>
              <div
                className="relative w-full aspect-[4/5] bg-brand-ivory-dark rounded-sm overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={(e) => handleTouchEnd(e, product.images.length)}
              >
                <Image
                  src={product.images[selectedImg] ?? ""}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                {product.isBundle && (
                  <span className="absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-gold text-brand-navy">
                    Bundle
                  </span>
                )}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImg(
                          (i) => (i - 1 + product.images.length) % product.images.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors text-brand-black"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImg((i) => (i + 1) % product.images.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors text-brand-black"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {product.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImg(i)}
                          className={`h-1.5 rounded-full transition-all duration-200 ${
                            i === selectedImg ? "w-4 bg-white" : "w-1.5 bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 pt-3 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImg(i)}
                      className={`relative shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-150 ${
                        i === selectedImg
                          ? "border-brand-gold"
                          : "border-brand-ivory-dark hover:border-brand-gold/50"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-5 lg:sticky lg:top-28">
              {/* Name + price */}
              <div>
                <h1 className="font-serif text-3xl font-bold text-brand-black leading-snug mb-2">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-semibold text-brand-gold-dark">
                    GHS {product.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-brand-black-light leading-relaxed">
                {product.description}
              </p>

              {/* Size */}
              <div>
                <p className="text-xs font-semibold text-brand-black uppercase tracking-widest mb-3">
                  Size
                </p>
                <input
                  type="text"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  placeholder="e.g. M, 12, or your measurements"
                  className="w-full border border-brand-ivory-dark rounded-full px-5 py-3 text-sm text-brand-black placeholder:text-brand-black-light/60 focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              {/* Quantity + live total */}
              <div>
                <p className="text-xs font-semibold text-brand-black uppercase tracking-widest mb-3">
                  Quantity
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-full border border-brand-ivory-dark flex items-center justify-center hover:bg-brand-ivory transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-base font-semibold w-6 text-center">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-9 h-9 rounded-full border border-brand-ivory-dark flex items-center justify-center hover:bg-brand-ivory transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Live total */}
                  <div className="text-right">
                    <p className="text-xs text-brand-black-light mb-0.5">Total</p>
                    <motion.p
                      key={qty}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className="font-serif text-xl font-bold text-brand-gold-dark"
                    >
                      GHS {(product.price * qty).toLocaleString()}
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2">
                <button
                  onClick={handleAdd}
                  disabled={!selectedSize.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm bg-brand-gradient text-white shadow-brand-glow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-brand-glow disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
                {!selectedSize.trim() && (
                  <p className="text-xs text-brand-black-light text-center mt-2">
                    Enter your size above to add to cart
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />

      {/* Added-to-cart alert */}
      <AnimatePresence>
        {added && (
          <motion.div
            initial={{ y: -56, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -56, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 inset-x-0 z-[60] bg-green-600 text-white px-6 py-3.5 flex items-center justify-between shadow-lg"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Check size={16} />
              Added to cart
            </span>
            <button
              onClick={() => setCartOpen(true)}
              className="text-xs font-bold uppercase tracking-[0.5px] underline underline-offset-2 hover:text-white/80 transition-colors"
            >
              View Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}