"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminProducts } from "@/lib/hooks/use-admin-products";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") ?? undefined;
  const [searchInput, setSearchInput] = useState(search ?? "");
  const { data: products = [], isLoading } = useAdminProducts({ search });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    router.push(`/admin/products?${params}`);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-8">
        <div>
          <p className="text-[10px] text-gray-muted font-body uppercase tracking-widest mb-1">Manage</p>
          <h1 className="font-heading font-bold text-2xl text-brand-navy">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-brand-navy text-white text-xs font-body font-medium px-4 py-2 hover:opacity-90 transition-opacity"
        >
          + Add Product
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products…"
          className="border border-gray-card px-4 py-2 text-sm font-body focus:outline-none focus:border-brand-navy bg-white flex-1 sm:flex-none sm:w-64"
        />
        <button
          type="submit"
          className="border border-gray-card bg-white px-4 py-2 text-sm font-body text-brand-navy hover:bg-gray-light transition-colors"
        >
          Search
        </button>
      </form>

      {isLoading ? (
        <div className="text-gray-muted text-sm py-12 text-center font-body">Loading…</div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-gray-card px-5 py-12 text-center text-gray-muted text-sm font-body">
          No products found.
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
            {products.map((p) => (
              <div key={p._id} className="bg-white border border-gray-card p-4 flex gap-3">
                <div className="w-14 h-14 overflow-hidden relative shrink-0 bg-gray-card">
                  {p.images[0] ? (
                    <Image src={p.images[0]} alt={p.name} fill sizes="56px" className="object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-brand-navy text-sm leading-tight line-clamp-2">{p.name}</p>
                  <p className="text-gray-muted text-xs font-body mt-0.5">{p.category}</p>
                  <p className="font-heading font-bold text-brand-navy text-sm mt-1">₵{p.price.toLocaleString()}</p>
                  {p.isBundle && (
                    <span className="inline-block mt-1 text-[10px] bg-brand-gold/10 text-brand-gold px-2 py-0.5 font-body font-medium">Bundle</span>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <Link href={`/admin/products/${p._id}/edit`} className="text-xs font-body text-brand-gold hover:underline">Edit</Link>
                    <DeleteProductButton id={p._id} name={p.name} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white border border-gray-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-card">
                    {["Image", "Name", "Category", "Price", "Type", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] font-body text-gray-muted uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b border-gray-card last:border-0 hover:bg-gray-light transition-colors">
                      <td className="px-5 py-3">
                        <div className="w-10 h-10 overflow-hidden relative bg-gray-card">
                          {p.images[0] ? (
                            <Image src={p.images[0]} alt={p.name} fill sizes="40px" className="object-cover" />
                          ) : null}
                        </div>
                      </td>
                      <td className="px-5 py-3 font-body font-medium text-brand-navy">{p.name}</td>
                      <td className="px-5 py-3 font-body text-gray-muted">{p.category}</td>
                      <td className="px-5 py-3 font-heading font-semibold text-brand-navy whitespace-nowrap">
                        ₵{p.price.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        {p.isBundle ? (
                          <span className="text-[10px] bg-brand-gold/10 text-brand-gold px-2 py-0.5 font-body font-medium">Bundle</span>
                        ) : (
                          <span className="text-[10px] bg-gray-light text-gray-muted px-2 py-0.5 font-body">Single</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Link href={`/admin/products/${p._id}/edit`} className="text-xs font-body text-brand-gold hover:underline">Edit</Link>
                          <DeleteProductButton id={p._id} name={p.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
