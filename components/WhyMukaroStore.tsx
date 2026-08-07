import { BadgeCheck, Layers, MapPin, CircleDollarSign } from "lucide-react";

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Curated quality",
    desc: "Every product is vetted before it hits our shelves. No counterfeits, no shortcuts.",
  },
  {
    icon: Layers,
    title: "Systems thinking",
    desc: "Bundles designed to solve your home and office needs end-to-end — not just one item at a time.",
  },
  {
    icon: MapPin,
    title: "Ghana-first delivery",
    desc: "Same-day in Accra. 2–4 days nationwide via Ghana Post GPS. No guesswork.",
  },
  {
    icon: CircleDollarSign,
    title: "No gimmicks",
    desc: "Honest prices, clear descriptions, no hidden charges. What you see is what you pay.",
  },
];

export default function WhyMukaroStore() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="max-w-xl mb-14">
          <p className="text-[11px] text-brand-gold font-body uppercase tracking-widest mb-3">
            Why us
          </p>
          <h2 className="font-heading font-bold text-3xl text-brand-navy leading-tight">
            The store we always wanted to buy from.
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-card">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white p-8 flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-light flex items-center justify-center">
                <Icon size={18} className="text-brand-navy" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-brand-navy text-base">
                  {title}
                </h3>
                <p className="text-gray-muted font-body text-sm leading-relaxed mt-1.5">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
