import type { Product } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

type Props = {
  products: Product[];
  title?: string;
  subtitle?: string;
};

export default function ProductGrid({ products, title, subtitle }: Props) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="mb-8 text-center">
            {title && (
              <h2 className="font-heading font-bold text-3xl text-brand-navy">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-muted font-body mt-2">{subtitle}</p>
            )}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-muted font-body text-lg">No products found.</p>
            <p className="text-gray-400 font-body text-sm mt-1">
              Try a different category or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
