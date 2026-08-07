import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/data";
import { CATEGORIES, SEED_PRODUCTS } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const SORT_OPTIONS = [
  { value: "popularity", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

type PageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
};

async function getProducts(
  category: string,
  sort: string,
  page: number
): Promise<{ products: Product[]; total: number; totalPages: number }> {
  try {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "12");

    const res = await fetch(`${siteUrl}/api/products?${params.toString()}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("Failed");
    return res.json() as Promise<{ products: Product[]; total: number; totalPages: number }>;
  } catch {
    // Fallback to seed data
    let products = [...SEED_PRODUCTS];
    if (category && category !== "All Products") {
      products = products.filter((p) => p.category === category);
    }
    if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
    else if (sort === "newest")
      products.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    else products.sort((a, b) => b.popularity - a.popularity);

    const limit = 12;
    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    return { products: products.slice(start, start + limit), total, totalPages };
  }
}

export default async function ShopPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const category = sp.category ?? "";
  const sort = sp.sort ?? "popularity";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const { products, total, totalPages } = await getProducts(category, sort, page);

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
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
          <Link href="/" className="hover:text-brand-gold transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brand-navy font-medium">Shop</span>
          {category && (
            <>
              <span className="mx-2">/</span>
              <span className="text-brand-gold">{category}</span>
            </>
          )}
        </p>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 shrink-0">
            <div className="bg-white rounded-xl border border-gray-card p-4">
              <h3 className="font-heading font-bold text-brand-navy text-sm mb-3">
                Categories
              </h3>
              <ul className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <Link
                      href={cat === "All Products" ? "/shop" : `/shop?category=${cat}`}
                      className={`block px-3 py-2 rounded-lg text-sm font-body transition-colors ${
                        (cat === "All Products" && !category) || cat === category
                          ? "bg-brand-navy text-white font-medium"
                          : "text-brand-navy hover:bg-gray-light"
                      }`}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <h3 className="font-heading font-bold text-brand-navy text-sm mb-3">
                  Sort By
                </h3>
                <div className="space-y-1">
                  {SORT_OPTIONS.map((opt) => (
                    <Link
                      key={opt.value}
                      href={buildUrl({ sort: opt.value, page: "1" })}
                      className={`block px-3 py-2 rounded-lg text-sm font-body transition-colors ${
                        sort === opt.value
                          ? "bg-brand-gold text-brand-navy font-medium"
                          : "text-brand-navy hover:bg-gray-light"
                      }`}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-muted font-body text-sm">
                {total} product{total !== 1 ? "s" : ""}{" "}
                {category ? `in ${category}` : ""}
              </p>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-muted font-body text-lg">
                  No products found.
                </p>
                <Link
                  href="/shop"
                  className="mt-4 inline-block text-brand-gold hover:underline font-body text-sm"
                >
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={buildUrl({ page: String(page - 1) })}
                    className="px-4 py-2 rounded-lg border border-gray-card text-brand-navy font-body text-sm hover:bg-gray-light transition-colors"
                  >
                    &larr; Prev
                  </Link>
                )}
                <span className="px-4 py-2 text-gray-muted font-body text-sm">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={buildUrl({ page: String(page + 1) })}
                    className="px-4 py-2 rounded-lg border border-gray-card text-brand-navy font-body text-sm hover:bg-gray-light transition-colors"
                  >
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
