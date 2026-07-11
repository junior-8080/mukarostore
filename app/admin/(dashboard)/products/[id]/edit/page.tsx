"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAdminCollections } from "@/lib/hooks/use-admin-collections";
import ProductForm from "@/components/admin/ProductForm";
import { AdminProduct } from "@/lib/hooks/use-admin-products";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading: loadingProduct } = useQuery<AdminProduct>({
    queryKey: ["admin", "product", id],
    queryFn: () => fetch(`/api/admin/products/${id}`).then((r) => r.json()),
  });

  const { data: collections = [] } = useAdminCollections();
  const options = collections.filter((c) => c.active).map((c) => ({ id: c.id, label: c.label }));

  if (loadingProduct) {
    return <div className="text-black/40 text-sm">Loading…</div>;
  }

  if (!product) {
    return <div className="text-red-500 text-sm">Product not found.</div>;
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-black mb-8">Edit Product</h1>
      <ProductForm
        initialData={{
          _id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          collections: product.collections,
          images: product.images,
          badge: product.badge,
          description: product.description,
          inStock: product.inStock,
        }}
        collectionOptions={options}
      />
    </div>
  );
}