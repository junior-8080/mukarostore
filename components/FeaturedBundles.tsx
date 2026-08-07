import Link from "next/link";
import type { Product } from "@/lib/data";
import AddToCartButton from "@/components/AddToCartButton";

type Props = {
  bundles: Product[];
};

export default function FeaturedBundles({ bundles }: Props) {
  const displayBundles = bundles.slice(0, 3);

  return (
    <section className="bg-brand-navy py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading font-bold text-3xl text-white text-center mb-2">
          Featured Bundles
        </h2>
        <p className="text-gray-400 font-body text-center mb-10">
          Curated sets that solve real home and office problems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayBundles.map((bundle) => (
            <div
              key={bundle._id}
              className="bg-[#0F1F35] border-2 border-brand-gold rounded-xl p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="bg-brand-gold text-brand-navy text-[10px] font-heading font-bold px-2 py-0.5 rounded-full uppercase">
                  BUNDLE
                </span>
              </div>
              <h3 className="font-heading font-bold text-white text-lg mb-1">
                {bundle.name}
              </h3>
              <p className="text-brand-gold font-heading font-bold text-2xl mb-4">
                GHS {bundle.price}
              </p>
              {bundle.bundleContents && bundle.bundleContents.length > 0 && (
                <ul className="mb-6 space-y-1 flex-1">
                  {bundle.bundleContents.map((item) => (
                    <li
                      key={item}
                      className="text-gray-300 text-sm font-body flex items-center gap-2"
                    >
                      <span className="text-brand-gold">✓</span> {item}
                    </li>
                  ))}
                </ul>
              )}
              <AddToCartButton product={bundle} />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/shop?category=Bundles"
            className="inline-flex border-2 border-white text-white font-heading font-bold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            View All Bundles
          </Link>
        </div>
      </div>
    </section>
  );
}
