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
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-ivory-dark">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-brand-gold" />
                <h2 className="font-serif text-lg font-semibold text-brand-black">
                  Cart
                </h2>
                {count > 0 && (
                  <span className="text-xs font-semibold bg-brand-gold text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-full hover:bg-brand-ivory transition-colors text-brand-black-light"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-brand-black-light">
                  <ShoppingBag size={40} strokeWidth={1.2} />
                  <p className="text-sm">Your cart is empty.</p>
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
                    key={`${item.product._id}-${item.size}`}
                    className="flex gap-4 bg-brand-ivory rounded-xl p-3"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden shrink-0 bg-brand-ivory-dark">
                      <Image
                        src={item.product.images[0] ?? "/landingPage/img06.jpeg"}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="font-serif text-sm font-semibold text-brand-black leading-snug line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-brand-black-light mt-0.5">
                          Size: {item.size}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Qty controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setQty(item.product._id, item.size, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded-full border border-brand-ivory-dark flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              setQty(item.product._id, item.size, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded-full border border-brand-ivory-dark flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-brand-gold-dark">
                            GHS {(item.product.price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => remove(item.product._id, item.size)}
                            className="text-brand-black-light hover:text-brand-gold transition-colors"
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
              <div className="px-6 py-5 border-t border-brand-ivory-dark space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-black-light">Subtotal</span>
                  <span className="font-serif text-lg font-bold text-brand-black">
                    GHS {subtotal.toLocaleString()}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="block w-full text-center bg-brand-gradient text-white font-semibold py-3.5 rounded-full shadow-brand-glow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}