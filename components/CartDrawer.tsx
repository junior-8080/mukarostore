"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const { items, remove, setQty, subtotal, count, cartOpen, setCartOpen } =
    useCart();
  const overlayRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-card">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-brand-gold" />
                <h2 className="font-heading text-lg font-bold text-brand-navy">
                  Cart
                </h2>
                {count > 0 && (
                  <span className="text-xs font-bold bg-brand-gold text-brand-navy rounded-full w-5 h-5 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-full hover:bg-gray-light transition-colors text-brand-navy"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-muted">
                  <ShoppingBag size={40} strokeWidth={1.2} />
                  <p className="text-sm font-body">Your cart is empty.</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="text-sm font-medium text-brand-gold underline underline-offset-2"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex gap-4 bg-gray-light rounded-xl p-3"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-card">
                      <Image
                        src={item.product.images[0] ?? "https://via.placeholder.com/80x80"}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="font-heading text-sm font-semibold text-brand-navy leading-snug line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-muted font-body mt-0.5">
                          {item.product.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Qty controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setQty(item.product._id, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded-full border border-gray-card flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center text-brand-navy">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              setQty(item.product._id, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded-full border border-gray-card flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-brand-gold">
                            GHS {(item.product.price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => remove(item.product._id)}
                            className="text-gray-muted hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-card space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-muted font-body">Subtotal</span>
                  <span className="font-heading text-lg font-bold text-brand-navy">
                    GHS {subtotal.toLocaleString()}
                  </span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="block w-full text-center bg-brand-gold text-brand-navy font-heading font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Go to Cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
