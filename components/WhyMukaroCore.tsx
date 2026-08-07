const FEATURES = [
  {
    icon: "✅",
    title: "Curated Quality",
    desc: "Every product is vetted before it hits our shelves.",
  },
  {
    icon: "⚙️",
    title: "Systems Thinking",
    desc: "Bundles designed to solve your home and office needs end-to-end.",
  },
  {
    icon: "🇬🇭",
    title: "Ghana-First Delivery",
    desc: "Same-day in Accra. 2-4 days nationwide via Ghana Post GPS.",
  },
  {
    icon: "💬",
    title: "No Gimmicks",
    desc: "Honest prices, clear descriptions, no hidden charges.",
  },
];

export default function WhyMukaroCore() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading font-bold text-3xl text-brand-navy text-center mb-2">
          Why MukaroCore?
        </h2>
        <p className="text-gray-muted font-body text-center mb-12">
          We built the store we always wanted to buy from.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col items-start gap-3">
              <span className="text-4xl">{f.icon}</span>
              <h3 className="font-heading font-bold text-brand-navy text-lg">
                {f.title}
              </h3>
              <p className="text-gray-muted font-body text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
