"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ProductForm from "@/components/admin/ProductForm";
import { AdminProduct } from "@/lib/hooks/use-admin-products";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading } = useQuery<AdminProduct>({
    queryKey: ["admin", "product", id],
    queryFn: () => fetch(`/api/admin/products/${id}`).then((r) => r.json()),
  });

  if (isLoading) {
    return <div className="text-gray-muted text-sm py-12 text-center font-body">Loading…</div>;
  }

  if (!product) {
    return <div className="text-red-500 text-sm font-body">Product not found.</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] text-gray-muted font-body uppercase tracking-widest mb-1">Products</p>
        <h1 className="font-heading font-bold text-2xl text-brand-navy">Edit Product</h1>
      </div>
      <ProductForm
        initialData={{
          _id: product._id,
          name: product.name,
          category: product.category,
          isBundle: product.isBundle,
          price: product.price,
          description: product.description,
          bundleContents: product.bundleContents,
          images: product.images,
          popularity: product.popularity,
          externalShop: product.externalShop?._id ?? "",
          commission: product.commission ?? undefined,
        }}
      />
    </div>
  );
}
