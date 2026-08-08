"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import SearchPreview from "@/components/SearchPreview";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/shop" },
  { label: "Bundles", href: "/shop?category=Bundles" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const { count } = useCart();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-brand-navy">
        {/* ── Main bar ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.png"
                alt="MukaroStore"
                width={100}
                height={44}
                className="h-11 w-40 object-contain"
                priority
              />
            </Link>

            {/* Desktop links — center */}
            <ul className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors duration-150 ${
                      isActive(link.href)
                        ? "text-brand-gold"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right: search + cart + CTA */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                <Search size={19} />
              </button>

              <Link
                href="/cart"
                aria-label="Cart"
                className="relative p-2 text-white/70 hover:text-white transition-colors"
              >
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span className="absolute -top-0 -right-0.5 w-4 h-4 bg-brand-gold text-brand-navy text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>

              <Link
                href="/shop"
                className="hidden md:inline-flex bg-brand-gold text-white text-xs font-heading font-bold px-4 py-2 rounded-lg hover:brightness-105 transition-all"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mobile tab strip ── */}
        <div className="md:hidden border-t border-white/8">
          <div className="flex items-center overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`shrink-0 px-5 py-2.5 text-xs font-body font-medium transition-colors border-b-2 ${
                  isActive(link.href)
                    ? "text-brand-gold border-brand-gold"
                    : "text-white/60 border-transparent hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <SearchPreview open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
