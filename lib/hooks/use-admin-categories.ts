import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AdminCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  createdAt: string;
}

export function useAdminCategories() {
  return useQuery<AdminCategory[]>({
    queryKey: ["admin", "categories"],
    queryFn: () => fetch("/api/admin/categories").then((r) => r.json()),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AdminCategory, "_id" | "slug" | "createdAt">) =>
      fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error ?? "Failed to create");
        return json;
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<AdminCategory> & { id: string }) =>
      fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error ?? "Failed to update");
        return json;
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/categories/${id}`, { method: "DELETE" }).then(async (r) => {
        if (!r.ok) throw new Error("Failed to delete");
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}
