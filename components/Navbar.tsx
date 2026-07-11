"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { NAV_LINKS } from "@/lib/data";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, setCartOpen } = useCart();
  const pathname = usePathname();

  // Landing page hero is a full-bleed dark image, so the nav starts light-on-dark there
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Announcement bar */}
      <div className="bg-brand-black text-brand-gold text-center text-[11px] sm:text-xs tracking-[1.5px] uppercase px-4 py-2">
        Bespoke fittings &amp; nationwide delivery across Ghana — Book your consultation today
      </div>

      <div
        className={`transition-all duration-300 ${
          scrolled || open ? "glass shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Wordmark */}
            <Link href="/" className="flex items-baseline gap-2">
              <span
                className={`font-serif italic text-2xl font-semibold tracking-wide ${
                  overHero ? "text-brand-black" : "text-brand-black"
                }`}
              >
                Sutura
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[2px] text-brand-black">
                by Feesah
              </span>
            </Link>

            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-xs font-semibold uppercase tracking-[0.6px] transition-colors duration-200 relative group ${
                      overHero
                        ? "text-white hover:text-brand-gold"
                        : "text-brand-black hover:text-brand-gold-dark"
                    }`}
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA + Cart + Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center gap-2 bg-brand-gold text-brand-black text-xs font-bold uppercase tracking-[0.5px] px-5 py-2.5 rounded-full hover:shadow-brand-glow hover:-translate-y-0.5 transition-all duration-200"
              >
                Shop Now
                <ArrowRight size={14} />
              </Link>

              {/* Shop icon — mobile only */}
              <Link
                href="/shop"
                className={`md:hidden p-2 transition-colors ${
                  overHero ? "text-white" : "text-brand-black"
                } hover:text-brand-gold`}
                aria-label="Go to shop"
              >
                <Store size={22} />
              </Link>

              {/* Cart icon */}
              <button
                onClick={() => setCartOpen(true)}
                className={`relative p-2 transition-colors ${
                  overHero ? "text-white" : "text-brand-black"
                } hover:text-brand-gold`}
                aria-label="Open cart"
              >
                <ShoppingBag size={22} />
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-gold text-brand-black text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {count > 9 ? "9+" : count}
                  </motion.span>
                )}
              </button>

              <button
                onClick={() => setOpen(!open)}
                className={`md:hidden p-2 ${overHero ? "text-white" : "text-brand-black"}`}
                aria-label="Toggle menu"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden glass border-t border-brand-gold/20 overflow-hidden"
            >
              <ul className="px-6 py-4 flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-sm font-semibold uppercase tracking-[0.6px] text-brand-black hover:text-brand-gold-dark transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/shop"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 bg-brand-gold text-brand-black text-xs font-bold uppercase tracking-[0.5px] px-5 py-2.5 rounded-full"
                  >
                    Shop Now <ArrowRight size={14} />
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}