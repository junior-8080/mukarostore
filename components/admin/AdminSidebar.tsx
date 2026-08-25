"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Store, Tag, X } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/external-shops", label: "External Shops", icon: Store },
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
      className={`fixed left-0 top-0 h-full w-56 bg-brand-navy flex flex-col z-30 transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <p className="font-heading font-bold text-white text-base">MukaroStore</p>
          <p className="text-white/30 text-[10px] font-body uppercase tracking-widest mt-0.5">Admin</p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-white/40 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-body transition-colors ${
                active
                  ? "text-brand-gold bg-white/8"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/10">
        <Link href="/" className="text-white/30 text-xs font-body hover:text-white/60 transition-colors">
          ← View store
        </Link>
      </div>
    </aside>
  );
}
