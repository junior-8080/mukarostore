import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import type { Product } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type PageProps = {
  searchParams: Promise<{ category?: string; sort?: string; page?: string; q?: string }>;
};

async function getCategoryNames(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return (data as { name: string }[]).map((c) => c.name);
  } catch {
    return [];
  }
}

async function getProducts(
  category: string,
  sort: string,
  page: number,
  q: string,
): Promise<{ products: Product[]; total: number; totalPages: number }> {
  try {
    const params = new URLSearchParams({ sort, page: String(page), limit: "12" });
    if (category && category !== "All Products") params.set("category", category);
    if (q) params.set("q", q);
    const res = await fetch(`${BASE}/api/products?${params}`, { cache: "no-store" });
    if (!res.ok) return { products: [], total: 0, totalPages: 0 };
    const data = await res.json();
    return { products: data.products ?? [], total: data.total ?? 0, totalPages: data.totalPages ?? 0 };
  } catch {
    return { products: [], total: 0, totalPages: 0 };
  }
}

export default async function ShopPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const category = sp.category ?? "";
  const sort = sp.sort ?? "popularity";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const q = sp.q?.trim() ?? "";

  const [{ products, total, totalPages }, categoryNames] = await Promise.all([
    getProducts(category, sort, page, q),
    getCategoryNames(),
  ]);

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (q) params.set("q", q);
    if (page > 1) params.set("page", String(page));
    for (const [k, v] of Object.entries(overrides)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    return `/shop?${params.toString()}`;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <p className="text-sm text-gray-muted font-body mb-6">
          <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-navy font-medium">Shop</span>
          {category && <><span className="mx-2">/</span><span className="text-brand-gold">{category}</span></>}
          {q && <><span className="mx-2">/</span><span className="text-brand-gold">&ldquo;{q}&rdquo;</span></>}
        </p>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <CategoryFilter activeCategory={category} categories={categoryNames} />

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <SearchBar initialValue={q} />
              <p className="text-gray-muted font-body text-sm shrink-0">
                {total} product{total !== 1 ? "s" : ""}
                {q && <> for &ldquo;{q}&rdquo;</>}
                {category && !q && <> in {category}</>}
                {q && (
                  <Link href="/shop" className="ml-2 text-brand-gold hover:underline">Clear</Link>
                )}
              </p>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-muted font-body text-lg">No products found.</p>
                <Link href="/shop" className="mt-4 inline-block text-brand-gold hover:underline font-body text-sm">
                  Browse all products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link href={buildUrl({ page: String(page - 1) })} className="px-4 py-2 border border-gray-card text-brand-navy font-body text-sm hover:bg-gray-light transition-colors">
                    &larr; Prev
                  </Link>
                )}
                <span className="px-4 py-2 text-gray-muted font-body text-sm">Page {page} of {totalPages}</span>
                {page < totalPages && (
                  <Link href={buildUrl({ page: String(page + 1) })} className="px-4 py-2 border border-gray-card text-brand-navy font-body text-sm hover:bg-gray-light transition-colors">
                    Next &rarr;
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
