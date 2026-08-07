import Link from "next/link";
import { MessageCircle, Phone, Mail } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Bundles", href: "/shop?category=Bundles" },
  { label: "About", href: "/#about" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand column */}
          <div>
            <p className="font-heading font-bold text-2xl text-brand-gold">MukaroCore</p>
            <p className="text-gray-400 text-sm font-body mt-2 max-w-[260px] leading-relaxed">
              Systems first. Hype last. Home and office essentials for Ghana, delivered with precision.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://wa.me/233200000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-gold transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="tel:+233200000000"
                className="text-gray-400 hover:text-brand-gold transition-colors"
                aria-label="Phone"
              >
                <Phone size={20} />
              </a>
              <a
                href="mailto:info@mukarocore.com"
                className="text-gray-400 hover:text-brand-gold transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-gray-400 text-sm font-body hover:text-brand-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-gold mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm font-body text-gray-400">
              <li className="flex items-center gap-2">
                <MessageCircle size={16} className="text-brand-gold shrink-0" />
                <a
                  href="https://wa.me/233200000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-brand-gold shrink-0" />
                <a
                  href="tel:+233200000000"
                  className="hover:text-brand-gold transition-colors"
                >
                  +233 20 000 0000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-brand-gold shrink-0" />
                <a
                  href="mailto:info@mukarocore.com"
                  className="hover:text-brand-gold transition-colors"
                >
                  info@mukarocore.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-gray-500 text-xs font-body">
            &copy; 2025 MukaroCore. Built on systems.
          </p>
        </div>
      </div>
    </footer>
  );
}
