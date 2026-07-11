import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/lib/data";

export interface ShopCollection {
  id: string;
  label: string;
}

export function useShopProducts(collection?: string) {
  return useQuery<Product[]>({
    queryKey: ["shop", "products", collection ?? "all"],
    queryFn: async () => {
      const sp = collection && collection !== "all" ? `?collection=${collection}` : "";
      const res = await fetch(`/api/products${sp}`);
      if (!res.ok) throw new Error("Failed to load products");
      return res.json();
    },
  });
}

export function useShopCollections() {
  return useQuery<ShopCollection[]>({
    queryKey: ["shop", "collections"],
    queryFn: async () => {
      const res = await fetch("/api/collections");
      if (!res.ok) throw new Error("Failed to load collections");
      return res.json();
    },
    staleTime: 5 * 60_000,
  });
}