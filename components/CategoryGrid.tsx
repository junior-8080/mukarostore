import Link from "next/link";

const CATEGORY_ITEMS = [
  { name: "Toiletries", icon: "🧴", hint: "Soaps, lotions, sanitizers" },
  { name: "Plastics", icon: "📦", hint: "Buckets, containers, bowls" },
  { name: "Cleaning", icon: "🧹", hint: "Floor cleaners, scrubs, brooms" },
  { name: "Office", icon: "📎", hint: "Paper, pens, stationery" },
  { name: "Bundles", icon: "🎁", hint: "Curated product sets", isBundle: true },
];

export default function CategoryGrid() {
  return (
    <section className="bg-gray-light py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading font-bold text-3xl text-brand-navy text-center mb-2">
          Shop by Category
        </h2>
        <p className="text-gray-muted text-center font-body mb-10">
          Everything your home and office needs, sorted.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {CATEGORY_ITEMS.map((cat) => (
            <Link
              key={cat.name}
              href={`/shop?category=${cat.name}`}
              className={`flex flex-col items-center gap-3 bg-white rounded-xl p-6 w-40 hover:shadow-lg cursor-pointer transition-shadow duration-200 ${
                cat.isBundle
                  ? "border-2 border-brand-gold"
                  : "border border-gray-card"
              }`}
            >
              <span className="text-4xl">{cat.icon}</span>
              <p
                className={`font-heading font-bold text-sm ${
                  cat.isBundle ? "text-brand-gold" : "text-brand-navy"
                }`}
              >
                {cat.name}
              </p>
              {cat.isBundle && (
                <span className="bg-brand-gold text-brand-navy text-[10px] font-heading font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  BUNDLES
                </span>
              )}
              <p className="text-gray-muted text-xs font-body text-center">
                {cat.hint} &rarr;
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
