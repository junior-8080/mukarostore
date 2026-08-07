"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle, ShoppingBag,
  Trash2, Minus, Plus, Smartphone, Landmark, Clock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";

const DELIVERY = 50;

// ── Payment details — update these with real info ─────────────────────────────
const MOMO = {
  network: "MTN Mobile Money",
  number: "059 1459 743",
  name: "NafisaMuslim",
};
const BANK = {
  bank: "Zenith bank",
  account: "6013100284",
  name: "NAFISA MUSLIM",
  branch: "Madina Branch",
};
// ─────────────────────────────────────────────────────────────────────────────

type FormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  notes: string;
};

const STEPS = ["Cart", "Delivery", "Payment"];

function slideVariants(dir: number) {
  return {
    enter: { x: dir > 0 ? 48 : -48, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: dir > 0 ? -48 : 48, opacity: 0 },
  };
}

export default function CheckoutPage() {
  const { items, subtotal, remove, setQty, clear } = useCart();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", location: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [savedTotal, setSavedTotal] = useState(0);
  const [paid, setPaid] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const total = subtotal + (items.length > 0 ? DELIVERY : 0);

  function goTo(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(next);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handlePlaceOrder(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        qty: item.quantity,
        image: item.product.images[0] ?? "",
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.location,
          },
          items: orderItems,
          total,
          notes: form.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to place order");

      setOrderNumber(data.orderNumber);
      setSavedTotal(total);
      clear();
      goTo(2);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 0: Cart ─────────────────────────────────────────────────────────
  const stepCart = (
    <div className="flex flex-col gap-6">
      <h2 className="font-serif text-xl font-bold text-brand-black">Your Cart</h2>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-brand-black-light">
          <ShoppingBag size={44} strokeWidth={1.2} />
          <p className="text-sm">Your cart is empty.</p>
          <Link href="/shop" className="text-sm font-medium text-brand-gold underline underline-offset-2">
            Go shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product._id} className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm">
                <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-brand-ivory-dark">
                  <Image src={item.product.images[0] ?? "/landingPage/img06.jpeg"} alt={item.product.name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="font-serif text-sm font-semibold text-brand-black leading-snug">{item.product.name}</p>
                    <p className="text-xs text-brand-black-light mt-0.5">{item.product.category}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQty(item.product._id, item.quantity - 1)} className="w-6 h-6 rounded-full border border-brand-ivory-dark flex items-center justify-center hover:bg-brand-ivory transition-colors">
                        <Minus size={11} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => setQty(item.product._id, item.quantity + 1)} className="w-6 h-6 rounded-full border border-brand-ivory-dark flex items-center justify-center hover:bg-brand-ivory transition-colors">
                        <Plus size={11} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-brand-gold-dark">GHS {(item.product.price * item.quantity).toLocaleString()}</span>
                      <button onClick={() => remove(item.product._id)} className="text-brand-black-light hover:text-brand-gold transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex justify-between text-sm text-brand-black-light"><span>Subtotal</span><span>GHS {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm text-brand-black-light"><span>Delivery</span><span>GHS {DELIVERY}</span></div>
            <div className="flex justify-between font-serif text-lg font-bold text-brand-black border-t border-brand-ivory-dark pt-2 mt-1">
              <span>Total</span><span>GHS {total.toLocaleString()}</span>
            </div>
          </div>

          <button onClick={() => goTo(1)} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-brand-gradient text-white font-semibold shadow-brand-glow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            Continue to Delivery <ArrowRight size={16} />
          </button>
        </>
      )}
    </div>
  );

  // ── Step 1: Delivery ──────────────────────────────────────────────────────
  const stepDelivery = (
    <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
      <h2 className="font-serif text-xl font-bold text-brand-black">Delivery Details</h2>

      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
        {items.map((item) => (
          <div key={item.product._id} className="flex items-center gap-3">
            <div className="relative w-10 h-12 rounded-lg overflow-hidden shrink-0 bg-brand-ivory-dark">
              <Image src={item.product.images[0] ?? "/landingPage/img06.jpeg"} alt={item.product.name} fill sizes="40px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-brand-black line-clamp-1">{item.product.name}</p>
              <p className="text-xs text-brand-black-light">Qty: {item.quantity}</p>
            </div>
            <span className="text-xs font-semibold text-brand-gold-dark shrink-0">GHS {(item.product.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between font-serif font-bold text-brand-black border-t border-brand-ivory-dark pt-2 text-sm">
          <span>Total</span><span>GHS {total.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-brand-black uppercase tracking-widest">Full Name *</label>
            <input required name="name" value={form.name} onChange={handleChange} placeholder="Amina Mensah"
              className="border border-brand-ivory-dark rounded-xl px-4 py-3 text-sm text-brand-black placeholder:text-brand-black-light/50 focus:outline-none focus:border-brand-gold transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-brand-black uppercase tracking-widest">Phone Number *</label>
            <input required name="phone" value={form.phone} onChange={handleChange} placeholder="0XX XXX XXXX"
              className="border border-brand-ivory-dark rounded-xl px-4 py-3 text-sm text-brand-black placeholder:text-brand-black-light/50 focus:outline-none focus:border-brand-gold transition-colors" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-brand-black uppercase tracking-widest">Email Address <span className="normal-case font-normal text-brand-black-light">(optional)</span></label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="amina@example.com"
            className="border border-brand-ivory-dark rounded-xl px-4 py-3 text-sm text-brand-black placeholder:text-brand-black-light/50 focus:outline-none focus:border-brand-gold transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-brand-black uppercase tracking-widest">Delivery Location *</label>
          <input required name="location" value={form.location} onChange={handleChange} placeholder="e.g. East Legon, Accra"
            className="border border-brand-ivory-dark rounded-xl px-4 py-3 text-sm text-brand-black placeholder:text-brand-black-light/50 focus:outline-none focus:border-brand-gold transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-brand-black uppercase tracking-widest">Order Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Special instructions, measurements, or requests…"
            className="border border-brand-ivory-dark rounded-xl px-4 py-3 text-sm text-brand-black placeholder:text-brand-black-light/50 focus:outline-none focus:border-brand-gold transition-colors resize-none" />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => goTo(0)} className="flex items-center gap-1.5 px-5 py-3.5 rounded-full border border-brand-ivory-dark text-sm font-medium text-brand-black hover:bg-brand-ivory transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-3.5 rounded-full bg-brand-gradient text-white font-semibold shadow-brand-glow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? "Placing Order…" : "Proceed to Payment"}
        </button>
      </div>
    </form>
  );

  // ── Step 2: Payment ───────────────────────────────────────────────────────
  const stepPayment = paid ? (
    /* ── After "I Have Paid" ── */
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="flex flex-col items-center text-center gap-6 py-10"
    >
      <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
        <Clock size={40} className="text-amber-500" strokeWidth={1.4} />
      </div>
      <div>
        <h2 className="font-serif text-2xl font-bold text-brand-black mb-2">
          Payment Submitted
        </h2>
        {orderNumber && (
          <p className="text-xs font-mono text-brand-black-light mb-3">
            Order <span className="font-semibold text-brand-black">{orderNumber}</span>
          </p>
        )}
        <p className="text-brand-black-light max-w-sm leading-relaxed">
          Thank you, <strong>{form.name}</strong>! Once we confirm your payment,
          we will contact you on <strong>{form.phone}</strong> to arrange delivery.
        </p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 text-sm text-amber-800 max-w-sm w-full text-left">
        <p className="font-semibold mb-1">What happens next?</p>
        <ol className="list-decimal list-inside space-y-1 text-amber-700">
          <li>We verify your payment (usually within 1 hour)</li>
          <li>We confirm your order via phone or WhatsApp</li>
          <li>Your order is packed and dispatched</li>
        </ol>
      </div>
      <Link href="/shop" className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold px-8 py-3.5 rounded-full shadow-brand-glow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        Continue Shopping
      </Link>
    </motion.div>
  ) : (
    /* ── Payment details ── */
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="font-serif text-xl font-bold text-brand-black mb-1">Pay for Your Order</h2>
        <p className="text-sm text-brand-black-light">
          Send exactly{" "}
          <span className="font-bold text-brand-gold-dark">GHS {savedTotal.toLocaleString()}</span>{" "}
          via any method below, then tap <em>I Have Paid</em>.
        </p>
      </div>

      {/* MoMo */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-brand-gold space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center">
            <Smartphone size={16} className="text-brand-gold" />
          </div>
          <p className="font-semibold text-brand-black text-sm">{MOMO.network}</p>
        </div>
        <div className="grid grid-cols-2 gap-y-2 text-sm pl-1">
          <span className="text-brand-black-light">Number</span>
          <span className="font-semibold text-brand-black">{MOMO.number}</span>
          <span className="text-brand-black-light">Name</span>
          <span className="font-semibold text-brand-black">{MOMO.name}</span>
          <span className="text-brand-black-light">Amount</span>
          <span className="font-bold text-brand-gold-dark">GHS {savedTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Bank */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-brand-black space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-black/10 flex items-center justify-center">
            <Landmark size={16} className="text-brand-black" />
          </div>
          <p className="font-semibold text-brand-black text-sm">{BANK.bank}</p>
        </div>
        <div className="grid grid-cols-2 gap-y-2 text-sm pl-1">
          <span className="text-brand-black-light">Account No.</span>
          <span className="font-semibold text-brand-black">{BANK.account}</span>
          <span className="text-brand-black-light">Account Name</span>
          <span className="font-semibold text-brand-black">{BANK.name}</span>
          <span className="text-brand-black-light">Branch</span>
          <span className="font-semibold text-brand-black">{BANK.branch}</span>
          <span className="text-brand-black-light">Amount</span>
          <span className="font-bold text-brand-gold-dark">GHS {savedTotal.toLocaleString()}</span>
        </div>
      </div>

      <p className="text-xs text-center text-brand-black-light px-4">
        Use your name <strong>{form.name}</strong> as the payment reference so we can match your order.
      </p>

      <button
        onClick={() => setPaid(true)}
        className="w-full py-4 rounded-full bg-green-600 text-white font-semibold text-base hover:bg-green-700 hover:-translate-y-0.5 shadow-lg transition-all duration-200"
      >
        I Have Paid
      </button>
    </div>
  );

  const panels = [stepCart, stepDelivery, stepPayment];

  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 lg:px-8 pt-28 pb-16">
        {step < 2 && (
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm text-brand-black-light hover:text-brand-gold transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Shop
          </Link>
        )}

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                  i < step ? "bg-green-500 text-white" : i === step ? "bg-brand-gold text-white" : "bg-brand-ivory-dark text-brand-black-light"
                }`}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className={`text-xs font-medium transition-colors duration-300 ${i === step ? "text-brand-black" : "text-brand-black-light"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-colors duration-500 ${i < step ? "bg-green-500" : "bg-brand-ivory-dark"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Animated panel */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={`${step}-${paid}`}
              custom={dir}
              variants={slideVariants(dir)}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {panels[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </>
  );
}