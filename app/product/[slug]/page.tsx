import Link from "next/link";
import { notFound } from "next/navigation";
import { Truck, Zap, MapPin, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ProductGallery from "@/components/ProductGallery";
import AddToCartSection from "@/components/AddToCartSection";
import type { Product } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string): Promise<{ product: Product; related: Product[] } | null> {
  try {
    const res = await fetch(`${BASE}/api/products/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb */}
        <p className="text-sm text-gray-muted font-body mb-5 sm:mb-8">
          <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-brand-gold transition-colors">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brand-navy">{product.name}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Left: Image */}
          <ProductGallery
            images={product.images || []}
            name={product.name}
            badge={product.isBundle ? "Bundle" : undefined}
          />

          {/* Right: Details */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-gray-muted text-xs font-body uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="font-heading font-bold text-3xl text-brand-navy mt-1">{product.name}</h1>
              <p className="font-heading font-bold text-2xl text-brand-gold mt-3">GHS {product.price}</p>
            </div>

            <p className="text-gray-muted font-body leading-relaxed">{product.description}</p>

            {product.isBundle && product.bundleContents && (
              <div>
                <h3 className="font-heading font-bold text-brand-navy text-sm mb-2">What&apos;s included:</h3>
                <ul className="space-y-1">
                  {product.bundleContents.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-brand-navy font-body text-sm">
                      <Check size={14} strokeWidth={3} className="text-brand-gold shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <AddToCartSection product={product} />

            <div className="bg-gray-light rounded-lg p-4 text-sm font-body text-gray-muted space-y-2">
              <p className="flex items-center gap-2">
                <Truck size={15} className="text-brand-gold shrink-0" />
                <span><strong className="text-brand-navy">Free delivery</strong> on orders over GHS 200</span>
              </p>
              <p className="flex items-center gap-2">
                <Zap size={15} className="text-brand-gold shrink-0" />
                Same-day delivery in Accra
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={15} className="text-brand-gold shrink-0" />
                2-4 days nationwide via Ghana Post GPS
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              {["MoMo", "Telecel Cash", "Bank Card"].map((method) => (
                <span key={method} className="border border-gray-card text-gray-muted text-xs font-body px-3 py-1 rounded-full">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-2xl text-brand-navy mb-6">Related Products</h2>
            <ProductGrid products={related} />
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
