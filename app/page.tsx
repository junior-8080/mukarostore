import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import FeaturedBundles from "@/components/FeaturedBundles";
import WhyMukaroCore from "@/components/WhyMukaroCore";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import type { Product } from "@/lib/data";
import { SEED_PRODUCTS } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Store",
      "@id": `${siteUrl}/#store`,
      name: "MukaroCore",
      description:
        "Ghana-based home and office essentials store. Quality toiletries, plastics, cleaning supplies, and office products delivered fast across Accra and nationwide.",
      url: siteUrl,
      logo: `${siteUrl}/logo.jpeg`,
      telephone: "+233200000000",
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
      name: "MukaroCore",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#store` },
    },
  ],
};

async function getPopularProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${siteUrl}/api/products?sort=popularity&limit=8`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json() as { products: Product[] };
    return data.products;
  } catch {
    // Fall back to seed data if DB is not connected
    return [...SEED_PRODUCTS]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 8);
  }
}

async function getFeaturedBundles(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${siteUrl}/api/products?category=Bundles&sort=popularity&limit=3`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json() as { products: Product[] };
    return data.products;
  } catch {
    return SEED_PRODUCTS.filter((p) => p.isBundle).slice(0, 3);
  }
}

export default async function Home() {
  const [popularProducts, bundles] = await Promise.all([
    getPopularProducts(),
    getFeaturedBundles(),
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Hero />
      <TrustBadges />
      <CategoryGrid />
      <ProductGrid
        products={popularProducts}
        title="Popular Products"
        subtitle="Our top-selling home and office essentials."
      />
      <FeaturedBundles bundles={bundles} />
      <WhyMukaroCore />
      <Newsletter />
      <Footer />
    </main>
  );
}
