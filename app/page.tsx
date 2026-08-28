import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import WhyMukaroStore from "@/components/WhyMukaroStore";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Store } from "lucide-react";
import type { Product, CategoryItem } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Store",
      "@id": `${siteUrl}/#store`,
      name: "MukaroStore",
      description:
        "Ghana-based home and office essentials store. Quality toiletries, plastics, cleaning supplies, and office products delivered fast across Accra and nationwide.",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      telephone: "+233545543359",
      email: "info@mukarocore.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Accra",
        addressCountry: "GH",
      },
      currenciesAccepted: "GHS",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "MukaroStore",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#store` },
    },
  ],
};

async function getCategories(): Promise<CategoryItem[]> {
  try {
    const res = await fetch(`${siteUrl}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getPopularProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${siteUrl}/api/products?sort=popularity&limit=12`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [popularProducts, categories] = await Promise.all([
    getPopularProducts(),
    getCategories(),
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Hero />
      <CategoryGrid categories={categories} />
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] text-gray-muted font-body uppercase tracking-widest mb-1">
                Top picks
              </p>
              <h2 className="font-heading font-bold text-2xl text-brand-navy">
                Popular Products
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-sm font-body text-brand-gold hover:underline underline-offset-4"
            >
              View all →
            </Link>
          </div>
          <ProductGrid products={popularProducts} />
        </div>
      </section>

      {/* Explore more banner */}
      <section className="px-4 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-brand-navy flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 py-8 sm:px-10 sm:py-10">
            <div>
              <h3 className="font-heading font-bold text-white text-xl sm:text-2xl leading-snug">
                There&apos;s a lot more<br className="hidden sm:block" /> where that came from.
              </h3>
            </div>
            <Link
              href="/shop"
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-white text-brand-navy font-heading font-bold text-sm px-7 py-3.5 hover:bg-gray-light transition-colors"
            >
              <Store size={16} className="shrink-0" />
              <span className="ml-2">Explore the full shop →</span>
            </Link>
          </div>
        </div>
      </section>

      <WhyMukaroStore />
      <Newsletter />
      <Footer />
    </main>
  );
}
