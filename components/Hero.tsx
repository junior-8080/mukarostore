import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-[85vh] bg-brand-navy flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left: Text content */}
          <div className="flex-1">
            <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white leading-tight">
              Home &amp; Office
              <br />
              Essentials,
              <br />
              <span className="text-brand-gold">Delivered.</span>
            </h1>
            <p className="mt-6 text-gray-300 text-lg max-w-xl font-body">
              Quality products for homes, offices, and institutions across Ghana.
              Fast delivery. No drama.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center bg-brand-gold text-brand-navy font-heading font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity text-base"
              >
                Shop Now
              </Link>
              <Link
                href="/shop?category=Bundles"
                className="inline-flex items-center border-2 border-white text-white font-heading font-bold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors text-base"
              >
                View Bundles
              </Link>
            </div>
          </div>

          {/* Right: Decorative grid */}
          <div className="hidden md:grid grid-cols-2 gap-4 flex-shrink-0">
            <div className="w-40 h-40 bg-brand-gold/20 border border-brand-gold/40 rounded-2xl flex flex-col items-center justify-center gap-2">
              <span className="text-4xl">🧴</span>
              <span className="text-brand-gold text-xs font-heading font-bold uppercase tracking-widest">
                Toiletries
              </span>
            </div>
            <div className="w-40 h-40 bg-brand-green/20 border border-brand-green/40 rounded-2xl flex flex-col items-center justify-center gap-2">
              <span className="text-4xl">🧹</span>
              <span className="text-brand-green text-xs font-heading font-bold uppercase tracking-widest">
                Cleaning
              </span>
            </div>
            <div className="w-40 h-40 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2">
              <span className="text-4xl">📦</span>
              <span className="text-white text-xs font-heading font-bold uppercase tracking-widest">
                Plastics
              </span>
            </div>
            <div className="w-40 h-40 bg-brand-gold/10 border border-brand-gold/20 rounded-2xl flex flex-col items-center justify-center gap-2">
              <span className="text-4xl">📎</span>
              <span className="text-brand-gold text-xs font-heading font-bold uppercase tracking-widest">
                Office
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
