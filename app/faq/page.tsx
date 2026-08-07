"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQS = [
  {
    section: "Orders & Delivery",
    items: [
      {
        q: "How fast will my order arrive?",
        a: "Same-day delivery in Accra for orders placed before 12pm. Nationwide delivery takes 2–4 business days via Ghana Post GPS.",
      },
      {
        q: "Is there a delivery fee?",
        a: "Delivery is free on all orders over GHS 200. Orders below that attract a flat GHS 15 delivery fee.",
      },
      {
        q: "Do you deliver outside Accra?",
        a: "Yes — we deliver nationwide across Ghana using Ghana Post GPS addresses. Just enter your GPS address at checkout.",
      },
      {
        q: "Can I track my order?",
        a: "After your order is confirmed, we'll reach out via WhatsApp with updates. A dedicated tracking page is coming soon.",
      },
    ],
  },
  {
    section: "Products & Bundles",
    items: [
      {
        q: "Are all products genuine?",
        a: "Yes. Every product on MukaroStore is sourced directly from verified suppliers and vetted before listing. No counterfeits, ever.",
      },
      {
        q: "What's included in a bundle?",
        a: "Each bundle page lists exactly what's inside. Bundles are curated to cover a specific need — home essentials, office cleaning, student packs, etc.",
      },
      {
        q: "Can I request a custom bundle?",
        a: "Yes! Reach out via WhatsApp and we'll put together a custom set based on your needs and budget.",
      },
      {
        q: "Are bundle prices cheaper than buying separately?",
        a: "Yes — bundles are priced to give you better value than buying each item individually.",
      },
    ],
  },
  {
    section: "Payment",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept MTN MoMo, Telecel Cash, and bank card payments. Select your preferred method at checkout.",
      },
      {
        q: "Is it safe to pay on MukaroStore?",
        a: "Yes. We don't store card details. All payments are processed securely and you'll receive confirmation via WhatsApp.",
      },
      {
        q: "Do you have promo codes?",
        a: "Yes! Use code MUKARO10 at checkout for 10% off your order. Follow us for more deals.",
      },
    ],
  },
  {
    section: "Returns & Support",
    items: [
      {
        q: "What if I receive a damaged or wrong item?",
        a: "Contact us on WhatsApp within 24 hours of delivery with a photo of the item. We'll arrange a replacement or refund promptly.",
      },
      {
        q: "Can I cancel or change my order?",
        a: "You can cancel or modify your order within 1 hour of placing it. WhatsApp us immediately and we'll sort it out.",
      },
      {
        q: "How do I reach customer support?",
        a: "WhatsApp is the fastest way to reach us — tap the button below. We respond within minutes during business hours (8am–8pm).",
      },
    ],
  },
];

const WHATSAPP_NUMBER = "233200000000";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20MukaroStore%2C%20I%20have%20a%20question%20about%20my%20order.`;

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-card last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-heading font-semibold text-brand-navy text-sm sm:text-base">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-muted shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="font-body text-gray-muted text-sm leading-relaxed pb-4">
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] text-gray-muted font-body uppercase tracking-widest mb-2">
            Help centre
          </p>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-brand-navy">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-muted font-body mt-3 text-sm sm:text-base">
            Can&apos;t find your answer? Tap the WhatsApp button below — we&apos;re fast.
          </p>
        </div>

        {/* FAQ sections */}
        <div className="space-y-10">
          {FAQS.map((section) => (
            <div key={section.section}>
              <p className="text-[10px] text-brand-gold font-body uppercase tracking-widest mb-3">
                {section.section}
              </p>
              <div className="bg-white border border-gray-card px-5">
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-14 bg-brand-navy px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-heading font-bold text-white text-lg">
              Still have questions?
            </h3>
            <p className="text-white/50 font-body text-sm mt-1">
              Our team is on WhatsApp — usually replies in minutes.
            </p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2.5 bg-[#25D366] text-white font-heading font-bold text-sm px-6 py-3.5 hover:brightness-105 transition-all"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>
        </div>

        {/* Back to shop */}
        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="text-sm font-body text-gray-muted hover:text-brand-navy transition-colors"
          >
            ← Back to shop
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
