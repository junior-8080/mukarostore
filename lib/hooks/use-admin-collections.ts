import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AdminCollection {
  _id: string;
  id: string;
  label: string;
  order: number;
  active: boolean;
}

export function useAdminCollections() {
  return useQuery<AdminCollection[]>({
    queryKey: ["admin", "collections"],
    queryFn: () => fetch("/api/admin/collections").then((r) => r.json()),
  });
}

export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; label: string; order: number; active: boolean }) =>
      fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        if (!r.ok) throw await r.json();
        return r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "collections"] }),
  });
}

export function useUpdateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminCollection> }) =>
      fetch(`/api/admin/collections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "collections"] }),
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/collections/${id}`, { method: "DELETE" }).then(async (r) => {
        if (!r.ok) throw await r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "collections"] }),
  });
}