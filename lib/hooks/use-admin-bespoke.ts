import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AdminBespokeRequest {
  _id: string;
  name: string;
  phone: string;
  occasion: string;
  preferredDate?: string;
  vision?: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
  updatedAt: string;
}

export function useAdminBespokeRequests(status?: string) {
  return useQuery<AdminBespokeRequest[]>({
    queryKey: ["admin", "bespoke", status ?? "all"],
    queryFn: () => {
      const sp = status ? `?status=${status}` : "";
      return fetch(`/api/admin/bespoke${sp}`).then((r) => r.json());
    },
  });
}

export function useUpdateBespokeRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminBespokeRequest> }) =>
      fetch(`/api/admin/bespoke/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        if (!r.ok) throw await r.json();
        return r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "bespoke"] }),
  });
}

export function useDeleteBespokeRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/bespoke/${id}`, { method: "DELETE" }).then(async (r) => {
        if (!r.ok) throw await r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "bespoke"] }),
  });
}