"use client";

import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] text-gray-muted font-body uppercase tracking-widest mb-1">Products</p>
        <h1 className="font-heading font-bold text-2xl text-brand-navy">Add Product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
