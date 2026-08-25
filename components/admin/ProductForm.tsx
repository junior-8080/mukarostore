"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ImageUploader from "./ImageUploader";

function useCategoryOptions() {
  return useQuery<{ name: string }[]>({
    queryKey: ["categories"],
    queryFn: () => fetch("/api/categories").then((r) => r.json()),
  });
}

function useExternalShopOptions() {
  return useQuery<{ _id: string; name: string; isActive: boolean }[]>({
    queryKey: ["admin", "external-shops"],
    queryFn: () => fetch("/api/admin/external-shops").then((r) => r.json()),
  });
}

interface ProductFormProps {
  initialData?: {
    _id?: string;
    name?: string;
    category?: string;
    isBundle?: boolean;
    price?: number;
    description?: string;
    bundleContents?: string[];
    images?: string[];
    popularity?: number;
    externalShop?: string;
    commission?: number;
  };
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const isEdit = !!initialData?._id;
  const { data: categoryOptions = [], isLoading: loadingCategories } = useCategoryOptions();
  const { data: shopOptions = [] } = useExternalShopOptions();

  const [name, setName] = useState(initialData?.name ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "Toiletries");
  const [isBundle, setIsBundle] = useState(initialData?.isBundle ?? false);
  const [price, setPrice] = useState(String(initialData?.price ?? ""));
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [bundleContentsRaw, setBundleContentsRaw] = useState(
    (initialData?.bundleContents ?? []).join("\n")
  );
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [popularity, setPopularity] = useState(String(initialData?.popularity ?? "50"));
  const [externalShop, setExternalShop] = useState(initialData?.externalShop ?? "");
  const [commission, setCommission] = useState(
    initialData?.commission != null ? String(initialData.commission) : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectableShops = shopOptions.filter(
    (s) => s.isActive || s._id === externalShop
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body = {
      name,
      category,
      isBundle,
      price: parseFloat(price),
      description,
      bundleContents: isBundle
        ? bundleContentsRaw.split("\n").map((s) => s.trim()).filter(Boolean)
        : undefined,
      images,
      popularity: parseInt(popularity, 10) || 50,
      externalShop: externalShop || null,
      commission: commission.trim() ? parseFloat(commission) : null,
    };

    const url = isEdit ? `/api/admin/products/${initialData._id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      let message = "Something went wrong";
      try { message = JSON.parse(text).error ?? message; } catch {}
      setError(message);
      setSaving(false);
      return;
    }

    await qc.invalidateQueries({ queryKey: ["admin", "products"] });
    await qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    router.push("/admin/products");
  }

  const inputCls =
    "w-full border border-gray-card px-3 py-2.5 text-sm font-body text-brand-navy focus:outline-none focus:border-brand-navy bg-white transition-colors";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loadingCategories}
            className={inputCls}
          >
            {loadingCategories ? (
              <option value="">Loading…</option>
            ) : categoryOptions.length === 0 ? (
              <option value="">No categories — add one first</option>
            ) : (
              categoryOptions.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
            Price (GHS) <span className="text-red-500">*</span>
          </label>
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
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsBundle((v) => !v)}
          className={`relative w-10 h-5 shrink-0 transition-colors ${
            isBundle ? "bg-brand-gold" : "bg-gray-card"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white shadow transition-transform ${
              isBundle ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm font-body text-gray-muted">This product is a bundle</span>
      </div>

      {isBundle && (
        <div>
          <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
            Bundle Contents (one item per line)
          </label>
          <textarea
            value={bundleContentsRaw}
            onChange={(e) => setBundleContentsRaw(e.target.value)}
            rows={4}
            placeholder={"Dove Body Wash\nDettol Sanitizer\nFlash Floor Cleaner"}
            className={inputCls + " resize-none"}
          />
        </div>
      )}

      <div>
        <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className={inputCls + " resize-none"}
        />
      </div>

      <div>
        <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-2">
          Images
        </label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <div>
        <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
          Popularity (0–100)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={popularity}
          onChange={(e) => setPopularity(e.target.value)}
          className={inputCls}
        />
        <p className="text-[10px] text-gray-muted font-body mt-1">Higher = appears first on home page.</p>
      </div>

      <div className="border-t border-gray-card pt-5">
        <p className="text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1">Internal only</p>
        <p className="text-xs text-gray-muted font-body mb-4">
          Not shown to buyers. Used to track which external shop supplies this product and
          MukaroStore&apos;s cut — the shop is owed price minus commission per unit sold.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
              External Shop
            </label>
            <select
              value={externalShop}
              onChange={(e) => setExternalShop(e.target.value)}
              className={inputCls}
            >
              <option value="">— None (in-house) —</option>
              {selectableShops.map((s) => (
                <option key={s._id} value={s._id}>{s.name}{!s.isActive ? " (inactive)" : ""}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
              Commission (GHS)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              disabled={!externalShop}
              placeholder="Your cut per unit"
              className={inputCls + " disabled:opacity-50"}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 font-body bg-red-50 px-3 py-2">{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-navy text-white font-body font-medium text-sm px-6 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="border border-gray-card px-6 py-2.5 text-sm font-body text-gray-muted hover:text-brand-navy hover:border-brand-navy transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
