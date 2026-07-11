"use client";

import { Instagram, Mail, Phone, MapPin, Music2, MessageCircle } from "lucide-react";
import Link from "next/link";

const SHOP_LINKS = [
  { label: "Ready-to-Wear", href: "/shop" },
  { label: "Bespoke Tailoring", href: "/#bespoke" },
  { label: "Bridal", href: "/shop" },
  { label: "Eid Collection", href: "/shop" },
];

const SUPPORT_LINKS = [
  { label: "Book a Fitting", href: "/#bespoke" },
  { label: "Shop All", href: "/shop" },
  { label: "Made-to-Fit Request", href: "/#bespoke" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white/75 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="font-serif italic text-2xl text-white">Sutura by Feesah</p>
            <p className="text-white/60 text-[13px] leading-[1.7] mt-3.5 max-w-[280px]">
              Bespoke tailoring, ready-to-wear and bridal wear for the modern modest
              woman. Designed and made in Accra.
            </p>
            <p className="flex items-center gap-2 text-[13px] text-white/60 mt-5">
              <MapPin size={14} className="text-brand-gold shrink-0" />
              Studio: East Legon, Accra, Ghana
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[1px] text-brand-gold mb-5">
              Shop
            </h4>
            <ul className="space-y-3">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-white/60 text-[13px] hover:text-brand-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[1px] text-brand-gold mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-white/60 text-[13px] hover:text-brand-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 className="text-xs font-bold uppercase tracking-[1px] text-brand-gold mb-5">
              Let&apos;s Connect
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://instagram.com/suturabyfeesah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 text-[13px] hover:text-brand-gold transition-colors"
                >
                  <Instagram size={15} className="text-brand-gold shrink-0" />
                  @suturabyfeesah
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@suturabyfeesah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 text-[13px] hover:text-brand-gold transition-colors"
                >
                  <Music2 size={15} className="text-brand-gold shrink-0" />
                  @suturabyfeesah
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/233203865161"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 text-[13px] hover:text-brand-gold transition-colors"
                >
                  <MessageCircle size={15} className="text-brand-gold shrink-0" />
                  WhatsApp Orders
                </a>
              </li>
              <li>
                <a
                  href="tel:+233203865161"
                  className="flex items-center gap-3 text-white/60 text-[13px] hover:text-brand-gold transition-colors"
                >
                  <Phone size={15} className="text-brand-gold shrink-0" />
                  020 386 5161
                </a>
              </li>
              <li>
                <a
                  href="mailto:suturabyfeesah@gmail.com"
                  className="flex items-center gap-3 text-white/60 text-[13px] hover:text-brand-gold transition-colors break-all"
                >
                  <Mail size={15} className="text-brand-gold shrink-0" />
                  suturabyfeesah@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-gold/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Sutura by Feesah. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">The Feesaheffect — Designed in Accra</p>
          <p className="text-white/30 text-xs">
            Powered by{" "}
            <a
              href="mailto:info@mukarocore.com"
              className="hover:text-white/60 transition-colors"
            >
              Mukarocore
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}