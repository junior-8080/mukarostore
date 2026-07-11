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
  const collection = searchParams.get("collection") ?? undefined;
  const [searchInput, setSearchInput] = useState(search ?? "");

  const { data: products = [], isLoading } = useAdminProducts({ search, collection });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    if (collection) params.set("collection", collection);
    router.push(`/admin/products?${params}`);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h1 className="font-serif text-2xl font-bold text-black">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-[#9B7A51] hover:bg-[#6C3D0C] text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3 mb-5 sm:mb-6">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products…"
          className="border border-[#CDCAC3] rounded-lg px-3 sm:px-4 py-2 text-sm focus:outline-none focus:border-[#9B7A51] bg-white flex-1 sm:flex-none sm:w-64"
        />
        <button
          type="submit"
          className="border border-[#CDCAC3] bg-white px-3 sm:px-4 py-2 text-sm rounded-lg hover:bg-[#FEFEFD] transition-colors shrink-0"
        >
          Search
        </button>
      </form>

      {isLoading ? (
        <div className="text-black/40 text-sm py-12 text-center">Loading…</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#CDCAC3] px-5 py-12 text-center text-black/40 text-sm">
          No products found.
        </div>
      ) : (
        <>
          {/* Card grid — mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
            {products.map((p) => (
              <div key={p._id} className="bg-white rounded-xl border border-[#CDCAC3] p-4 flex gap-3">
                {p.images[0] ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden relative shrink-0 bg-[#CDCAC3]">
                    <Image src={p.images[0]} alt={p.name} fill sizes="64px" className="object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-[#CDCAC3] shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-black text-sm leading-tight line-clamp-2">{p.name}</p>
                  <p className="text-black text-sm font-semibold mt-1">₵{p.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-medium ${p.inStock ? "text-green-600" : "text-red-500"}`}>
                      {p.inStock ? "In Stock" : "Out"}
                    </span>
                    {p.badge && (
                      <span className="bg-[#9B7A51]/10 text-[#9B7A51] text-[10px] px-2 py-0.5 rounded-full font-medium">{p.badge}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <Link href={`/admin/products/${p._id}/edit`} className="text-xs text-[#9B7A51] hover:underline font-medium">Edit</Link>
                    <DeleteProductButton id={p._id} name={p.name} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table — tablet/desktop */}
          <div className="hidden md:block bg-white rounded-xl border border-[#CDCAC3] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#CDCAC3]">
                    {["Image", "Name", "Price", "Collections", "Badge", "Stock", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-black/50 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b border-[#CDCAC3] last:border-0 hover:bg-[#FEFEFD]">
                      <td className="px-5 py-3">
                        {p.images[0] ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-[#CDCAC3]">
                            <Image src={p.images[0]} alt={p.name} fill sizes="48px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#CDCAC3]" />
                        )}
                      </td>
                      <td className="px-5 py-3 font-medium text-black">{p.name}</td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-black">₵{p.price.toLocaleString()}</span>
                        {p.originalPrice && (
                          <span className="ml-1 text-black/40 line-through text-xs">₵{p.originalPrice}</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.collections.map((c) => (
                            <span key={c} className="bg-[#FEFEFD] text-black/60 text-[10px] px-2 py-0.5 rounded-full border border-[#CDCAC3]">{c}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {p.badge && (
                          <span className="bg-[#9B7A51]/10 text-[#9B7A51] text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{p.badge}</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium whitespace-nowrap ${p.inStock ? "text-green-600" : "text-red-500"}`}>
                          {p.inStock ? "In Stock" : "Out"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Link href={`/admin/products/${p._id}/edit`} className="text-xs text-[#9B7A51] hover:underline">Edit</Link>
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