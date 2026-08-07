import Link from "next/link";
import { MessageCircle, Phone, Mail } from "lucide-react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Bundles", href: "/shop?category=Bundles" },
  { label: "FAQ", href: "/faq" },
];

const CONTACT = [
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/233200000000" },
  { icon: Phone,         label: "+233 20 000 0000", href: "tel:+233200000000" },
  { icon: Mail,          label: "info@mukarocore.com", href: "mailto:info@mukarocore.com" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-light border-t border-gray-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="shrink-0 max-w-[240px]">
            <p className="font-heading font-bold text-xl text-brand-navy">MukaroStore</p>
            <p className="text-[10px] text-gray-muted font-body uppercase tracking-widest mt-0.5">
              Systems First.
            </p>
            <p className="text-gray-muted text-sm font-body mt-4 leading-relaxed">
              Home and office essentials for Ghana, delivered with precision.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-gray-muted font-body uppercase tracking-widest mb-1">
              Explore
            </p>
            {NAV.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm font-body text-brand-navy hover:text-brand-gold transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] text-gray-muted font-body uppercase tracking-widest mb-1">
              Contact
            </p>
            {CONTACT.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2.5 text-sm font-body text-brand-navy hover:text-brand-gold transition-colors"
              >
                <Icon size={15} className="text-gray-muted shrink-0" />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-card flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs font-body text-gray-muted">
            &copy; {new Date().getFullYear()} MukaroStore. All rights reserved.
          </p>
          <p className="text-xs font-body text-gray-muted">
            Built on systems.
          </p>
        </div>
      </div>
    </footer>
  );
}
