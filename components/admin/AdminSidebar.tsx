"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, ShoppingCart, X } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/collections", label: "Collections", icon: Tag },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const path = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-64 lg:w-52 bg-brand-black flex flex-col z-30 transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="px-6 py-7 border-b border-white/10 flex items-center justify-between">
        <div>
          <p className="font-serif text-brand-gold text-lg font-semibold">Dasanda</p>
          <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-gold text-brand-black"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-white/10">
        <Link href="/" className="text-white/40 text-xs hover:text-white/70 transition-colors">
          ← View Shop
        </Link>
      </div>
    </aside>
  );
}