"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/lib/cart-context";
import { DELIVERY_FEE, DELIVERY_THRESHOLD } from "@/lib/data";

type PaymentMethod = "MoMo" | "Card" | "Bank Transfer";

type CustomerForm = {
  name: string;
  phone: string;
  gpsAddress: string;
};

type PromoState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "valid"; code: string; percentOff: number }
  | { status: "invalid" };

type OrderState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; orderNumber: string }
  | { status: "error"; message: string };

export default function CartPage() {
  const { items, remove, setQty, clear, subtotal } = useCart();

  const [customer, setCustomer] = useState<CustomerForm>({
    name: "",
    phone: "",
    gpsAddress: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MoMo");
  const [promoCode, setPromoCode] = useState("");
  const [promoState, setPromoState] = useState<PromoState>({ status: "idle" });
  const [orderState, setOrderState] = useState<OrderState>({ status: "idle" });

  const discount =
    promoState.status === "valid"
      ? Math.round(((subtotal * promoState.percentOff) / 100) * 100) / 100
      : 0;
  const deliveryFee = subtotal - discount >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal - discount + deliveryFee;

  const canPlaceOrder =
    items.length > 0 &&
    customer.name.trim() &&
    customer.phone.trim() &&
    customer.gpsAddress.trim();

  async function applyPromo() {
    if (!promoCode.trim()) return;
    setPromoState({ status: "loading" });
    try {
      const res = await fetch("/api/cart/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim() }),
      });
      const data = (await res.json()) as { valid: boolean; percentOff?: number };
      if (data.valid && data.percentOff) {
        setPromoState({
          status: "valid",
          code: promoCode.trim().toUpperCase(),
          percentOff: data.percentOff,
        });
      } else {
        setPromoState({ status: "invalid" });
      }
    } catch {
      setPromoState({ status: "invalid" });
    }
  }

  async function placeOrder() {
    if (!canPlaceOrder) return;
    setOrderState({ status: "submitting" });
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product._id,
            qty: i.quantity,
          })),
          customer,
          paymentMethod,
          promoCode:
            promoState.status === "valid" ? promoState.code : undefined,
        }),
      });
      const data = (await res.json()) as { orderNumber?: string; error?: string };
      if (!res.ok || !data.orderNumber) {
        setOrderState({
          status: "error",
          message: data.error ?? "Something went wrong",
        });
        return;
      }
      clear();
      setOrderState({ status: "success", orderNumber: data.orderNumber });
    } catch {
      setOrderState({ status: "error", message: "Network error. Please try again." });
    }
  }

  // Confirmation state
  if (orderState.status === "success") {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-gray-card p-6 sm:p-10 max-w-md w-full text-center shadow-lg">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-brand-green" strokeWidth={1.75} />
            </div>
            <h2 className="font-heading font-bold text-2xl text-brand-navy mb-2">
              Order Placed!
            </h2>
            <p className="text-gray-muted font-body mb-4">
              Your order has been received and is being processed.
            </p>
            <div className="bg-gray-light rounded-lg px-6 py-3 mb-6 inline-block">
              <p className="text-xs text-gray-muted font-body">Order Number</p>
              <p className="font-heading font-bold text-brand-gold text-xl">
                {orderState.orderNumber}
              </p>
            </div>
            <p className="text-gray-muted font-body text-sm mb-6">
              We&apos;ll reach out via WhatsApp or call to confirm delivery.
            </p>
            <Link
              href="/shop"
              className="inline-flex bg-brand-gold text-brand-navy font-heading font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ${items.length > 0 ? "pb-28 lg:pb-10" : ""}`}>
        <h1 className="font-heading font-bold text-3xl text-brand-navy mb-8">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-muted font-body text-lg mb-4">
              Your cart is empty.
            </p>
            <Link
              href="/shop"
              className="inline-flex bg-brand-gold text-brand-navy font-heading font-bold px-6 py-3 rounded-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Items + form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart items */}
              <div className="bg-white rounded-xl border border-gray-card overflow-hidden">
                {items.map((item, index) => (
                  <div
                    key={item.product._id}
                    className={`flex gap-4 p-4 ${
                      index < items.length - 1
                        ? "border-b border-gray-card"
                        : ""
                    }`}
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-card shrink-0">
                      <ProductImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-brand-navy text-sm leading-tight">
                        {item.product.name}
                      </p>
                      <p className="text-gray-muted text-xs font-body mt-0.5">
                        {item.product.category}
                      </p>
                      <p className="font-heading font-bold text-brand-navy text-sm mt-1">
                        GHS {item.product.price}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center border border-gray-card rounded-lg overflow-hidden text-sm">
                        <button
                          onClick={() =>
                            setQty(item.product._id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-light text-brand-navy font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-heading text-brand-navy">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQty(item.product._id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-light text-brand-navy font-bold"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-heading font-bold text-brand-navy text-sm">
                        GHS {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => remove(item.product._id)}
                        className="text-red-400 hover:text-red-600 text-xs font-body transition-colors py-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery details */}
              <div className="bg-white rounded-xl border border-gray-card p-6">
                <h2 className="font-heading font-bold text-brand-navy text-lg mb-4">
                  Delivery Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-body text-brand-navy mb-1">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kofi Mensah"
                      value={customer.name}
                      onChange={(e) =>
                        setCustomer((c) => ({ ...c, name: e.target.value }))
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-card font-body text-brand-navy focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-brand-navy mb-1">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0XX XXX XXXX"
                      value={customer.phone}
                      onChange={(e) =>
                        setCustomer((c) => ({ ...c, phone: e.target.value }))
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-card font-body text-brand-navy focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-brand-navy mb-1">
                      Ghana Post GPS Address{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GA-123-4567"
                      value={customer.gpsAddress}
                      onChange={(e) =>
                        setCustomer((c) => ({
                          ...c,
                          gpsAddress: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-card font-body text-brand-navy focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-xl border border-gray-card p-6">
                <h2 className="font-heading font-bold text-brand-navy text-lg mb-4">
                  Payment Method
                </h2>
                <div className="flex flex-wrap gap-3">
                  {(["MoMo", "Card", "Bank Transfer"] as PaymentMethod[]).map(
                    (method) => (
                      <label
                        key={method}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          paymentMethod === method
                            ? "border-brand-gold bg-brand-gold/10"
                            : "border-gray-card hover:border-brand-gold/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="accent-brand-gold"
                        />
                        <span className="font-heading font-semibold text-brand-navy text-sm">
                          {method}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-card p-6 sticky top-4">
                <h2 className="font-heading font-bold text-brand-navy text-lg mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm font-body">
                  <div className="flex justify-between">
                    <span className="text-gray-muted">Subtotal</span>
                    <span className="text-brand-navy font-semibold">
                      GHS {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-muted">Delivery</span>
                    {deliveryFee === 0 ? (
                      <span className="text-brand-green font-semibold">
                        FREE
                      </span>
                    ) : (
                      <span className="text-brand-navy">GHS {deliveryFee}</span>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-brand-green">Discount</span>
                      <span className="text-brand-green font-semibold">
                        -GHS {discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-card pt-3 flex justify-between">
                    <span className="font-heading font-bold text-brand-navy">
                      Total
                    </span>
                    <span className="font-heading font-bold text-brand-navy text-lg">
                      GHS {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Promo code */}
                <div className="mt-5">
                  <label className="block text-sm font-body text-brand-navy mb-1">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. MUKARO10"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        if (promoState.status !== "idle") {
                          setPromoState({ status: "idle" });
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-card font-body text-brand-navy text-sm focus:outline-none focus:border-brand-gold"
                    />
                    <button
                      onClick={applyPromo}
                      disabled={promoState.status === "loading"}
                      className="bg-brand-navy text-white font-heading font-bold text-sm px-3 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {promoState.status === "valid" && (
                    <p className="text-brand-green text-xs font-body mt-1">
                      {promoState.code} applied — {promoState.percentOff}% off!
                    </p>
                  )}
                  {promoState.status === "invalid" && (
                    <p className="text-red-400 text-xs font-body mt-1">
                      Invalid promo code.
                    </p>
                  )}
                </div>

                {/* Delivery note */}
                {subtotal < DELIVERY_THRESHOLD && (
                  <p className="text-xs font-body text-gray-muted mt-4 bg-gray-light rounded-lg p-3">
                    Add GHS {(DELIVERY_THRESHOLD - subtotal).toFixed(2)} more
                    for free delivery!
                  </p>
                )}

                {/* Error */}
                {orderState.status === "error" && (
                  <p className="text-red-400 text-xs font-body mt-3">
                    {orderState.message}
                  </p>
                )}

                {/* Place order */}
                <button
                  onClick={placeOrder}
                  disabled={!canPlaceOrder || orderState.status === "submitting"}
                  className="mt-5 w-full bg-brand-gold text-brand-navy font-heading font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {orderState.status === "submitting"
                    ? "Placing Order..."
                    : "Place Order"}
                </button>
                <p className="text-gray-muted text-xs font-body text-center mt-2">
                  We&apos;ll confirm via WhatsApp or call.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky mobile total + place order — keeps the primary action reachable
          without scrolling past the full delivery form on small screens. */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-card px-4 py-3 flex items-center gap-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-muted font-body uppercase tracking-widest">Total</p>
            <p className="font-heading font-bold text-brand-navy text-lg leading-tight">
              GHS {total.toFixed(2)}
            </p>
          </div>
          <button
            onClick={placeOrder}
            disabled={!canPlaceOrder || orderState.status === "submitting"}
            className="bg-brand-gold text-brand-navy font-heading font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {orderState.status === "submitting" ? "Placing…" : "Place Order"}
          </button>
        </div>
      )}

      <Footer />
    </>
  );
}
