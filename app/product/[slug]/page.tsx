import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import AddToCartSection from "@/components/AddToCartSection";
import type { Product } from "@/lib/data";
import { SEED_PRODUCTS } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getProduct(
  slug: string
): Promise<{ product: Product; related: Product[] } | null> {
  try {
    const res = await fetch(`${siteUrl}/api/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<{ product: Product; related: Product[] }>;
  } catch {
    // Fallback to seed data
    const product = SEED_PRODUCTS.find((p) => p.slug === slug);
    if (!product) return null;
    const related = SEED_PRODUCTS.filter(
      (p) => p.category === product.category && p.slug !== slug
    ).slice(0, 4);
    return { product, related };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data) notFound();

  const { product, related } = data;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <p className="text-sm text-gray-muted font-body mb-8">
          <Link href="/" className="hover:text-brand-gold transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="hover:text-brand-gold transition-colors"
          >
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brand-navy">{product.name}</span>
        </p>

        {/* Main product layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Left: Image */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-card">
              <Image
                src={product.images[0] ?? "https://via.placeholder.com/400x400"}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.isBundle && (
                <span className="absolute top-4 left-4 bg-brand-gold text-brand-navy text-xs font-heading font-bold px-3 py-1 rounded-full uppercase">
                  Bundle
                </span>
              )}
            </div>
            {/* Thumbnail placeholders */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-gray-card overflow-hidden relative border-2 border-transparent hover:border-brand-gold cursor-pointer transition-colors"
                >
                  <Image
                    src={
                      product.images[i] ??
                      "https://via.placeholder.com/100x100"
                    }
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="10vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-gray-muted text-xs font-body uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="font-heading font-bold text-3xl text-brand-navy mt-1">
                {product.name}
              </h1>
              <p className="font-heading font-bold text-2xl text-brand-gold mt-3">
                GHS {product.price}
              </p>
            </div>

            <p className="text-gray-muted font-body leading-relaxed">
              {product.description}
            </p>

            {/* Bundle contents */}
            {product.isBundle && product.bundleContents && (
              <div>
                <h3 className="font-heading font-bold text-brand-navy text-sm mb-2">
                  What&apos;s included:
                </h3>
                <ul className="space-y-1">
                  {product.bundleContents.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-brand-navy font-body text-sm"
                    >
                      <span className="text-brand-gold font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to cart section (client component) */}
            <AddToCartSection product={product} />

            {/* Delivery info */}
            <div className="bg-gray-light rounded-lg p-4 text-sm font-body text-gray-muted space-y-1">
              <p>
                📦 <strong>Free delivery</strong> on orders over GHS 200
              </p>
              <p>🚀 Same-day delivery in Accra</p>
              <p>🇬🇭 2-4 days nationwide via Ghana Post GPS</p>
            </div>

            {/* Payment badges */}
            <div className="flex gap-2 flex-wrap">
              {["MoMo", "Telecel Cash", "Bank Card"].map((method) => (
                <span
                  key={method}
                  className="border border-gray-card text-gray-muted text-xs font-body px-3 py-1 rounded-full"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-2xl text-brand-navy mb-6">
              Related Products
            </h2>
            <ProductGrid products={related} />
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
