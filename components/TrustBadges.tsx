import { Zap, ShieldCheck, Package, MessageCircle } from "lucide-react";

const BADGES = [
  {
    icon: Zap,
    title: "Same-day delivery",
    subtitle: "Order before 12pm in Accra",
  },
  {
    icon: ShieldCheck,
    title: "Genuine products",
    subtitle: "Every item vetted before listing",
  },
  {
    icon: Package,
    title: "Free over GHS 200",
    subtitle: "No minimum on bundles",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp support",
    subtitle: "Real humans, fast replies",
  },
];

export default function TrustBadges() {
  return (
    <section className="border-b border-gray-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-card">
          {BADGES.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex items-center gap-3 px-6 py-5"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-brand-gold" strokeWidth={2} />
              </div>
              <div>
                <p className="font-heading font-semibold text-brand-navy text-sm leading-tight">
                  {title}
                </p>
                <p className="text-gray-muted text-xs font-body mt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
