"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import ImageUploader from "./ImageUploader";

interface CollectionOption {
  id: string;
  label: string;
}

interface ProductFormProps {
  initialData?: {
    _id?: string;
    name?: string;
    price?: number;
    originalPrice?: number;
    collections?: string[];
    images?: string[];
    badge?: string;
    description?: string;
    inStock?: boolean;
  };
  collectionOptions: CollectionOption[];
}

const BADGE_OPTIONS = ["", "Best Seller", "New", "Eid Special", "Sale", "Limited"];

export default function ProductForm({ initialData, collectionOptions }: ProductFormProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const isEdit = !!initialData?._id;

  const [name, setName] = useState(initialData?.name ?? "");
  const [price, setPrice] = useState(String(initialData?.price ?? ""));
  const [originalPrice, setOriginalPrice] = useState(String(initialData?.originalPrice ?? ""));
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialData?.collections ?? []
  );
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [badge, setBadge] = useState(initialData?.badge ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [inStock, setInStock] = useState(initialData?.inStock ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleCollection(id: string) {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body = {
      name,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      collections: selectedCollections,
      images,
      badge: badge || undefined,
      description,
      inStock,
    };

    const url = isEdit ? `/api/admin/products/${initialData._id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setSaving(false);
      return;
    }

    await qc.invalidateQueries({ queryKey: ["admin", "products"] });
    await qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    router.push("/admin/products");
  }

  const inputCls =
    "w-full border border-[#CDCAC3] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B7A51] transition-colors bg-white";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 sm:space-y-6">
      <div>
        <label className="block text-xs font-medium text-black/60 mb-1.5">Product Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-black/60 mb-1.5">Price (GHS) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-black/60 mb-1.5">
            Original Price (GHS) optional
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-black/60 mb-2">Collections</label>
        <div className="flex flex-wrap gap-2">
          {collectionOptions.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => toggleCollection(col.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedCollections.includes(col.id)
                  ? "bg-[#9B7A51] border-[#9B7A51] text-white"
                  : "border-[#CDCAC3] text-black/50 hover:border-[#9B7A51]"
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-black/60 mb-1.5">Badge</label>
        <select value={badge} onChange={(e) => setBadge(e.target.value)} className={inputCls}>
          {BADGE_OPTIONS.map((b) => (
            <option key={b} value={b}>{b || "none"}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-black/60 mb-1.5">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-black/60 mb-2">Images</label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setInStock((v) => !v)}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            inStock ? "bg-[#9B7A51]" : "bg-[#CDCAC3]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              inStock ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm text-black/60">{inStock ? "In Stock" : "Out of Stock"}</span>
      </div>

      {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#6C3D0C] hover:bg-[#9B7A51] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="border border-[#CDCAC3] px-6 py-2.5 rounded-lg text-sm text-black/50 hover:bg-[#FDE7C7] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}