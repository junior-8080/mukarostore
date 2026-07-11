"use client";

import { useAdminCollections } from "@/lib/hooks/use-admin-collections";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  const { data: collections = [] } = useAdminCollections();
  const options = collections.filter((c) => c.active).map((c) => ({ id: c.id, label: c.label }));

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-black mb-8">Add Product</h1>
      <ProductForm collectionOptions={options} />
    </div>
  );
}