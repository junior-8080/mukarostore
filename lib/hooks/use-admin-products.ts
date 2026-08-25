import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AdminProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  isBundle: boolean;
  price: number;
  description: string;
  bundleContents?: string[];
  images: string[];
  popularity: number;
  externalShop?: { _id: string; name: string } | null;
  commission?: number | null;
}

export function useAdminProducts(params: { search?: string } = {}) {
  return useQuery<AdminProduct[]>({
    queryKey: ["admin", "products", params],
    queryFn: () => {
      const sp = new URLSearchParams();
      if (params.search) sp.set("search", params.search);
      return fetch(`/api/admin/products?${sp}`).then((r) => r.json());
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}