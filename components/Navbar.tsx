"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Bundles", href: "/shop?category=Bundles" },
  { label: "About", href: "/#about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-brand-navy shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight">
            <span className="font-heading font-bold text-xl text-brand-gold tracking-tight">
              MukaroCore
            </span>
            <span className="text-[10px] text-gray-400 font-body tracking-widest uppercase">
              Systems First.
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm font-body font-medium text-white hover:text-brand-gold transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: Cart + CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative p-2 text-white hover:text-brand-gold transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-gold text-brand-navy text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            <Link
              href="/shop"
              className="hidden md:inline-flex bg-brand-gold text-brand-navy text-sm font-heading font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Shop Now
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white hover:text-brand-gold transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-navy border-t border-white/10">
          <ul className="px-4 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-body font-medium text-white hover:text-brand-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="inline-flex bg-brand-gold text-brand-navy text-sm font-heading font-bold px-4 py-2 rounded-lg"
              >
                Shop Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
