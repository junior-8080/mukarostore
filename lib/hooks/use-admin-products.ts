import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AdminProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  collections: string[];
  images: string[];
  badge?: string;
  description: string;
  inStock: boolean;
}

export function useAdminProducts(params: { search?: string; collection?: string } = {}) {
  return useQuery<AdminProduct[]>({
    queryKey: ["admin", "products", params],
    queryFn: () => {
      const sp = new URLSearchParams();
      if (params.search) sp.set("search", params.search);
      if (params.collection) sp.set("collection", params.collection);
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