import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AdminExternalShop {
  _id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  paymentMethod: "MoMo" | "Bank Transfer";
  momoNumber: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
}

export function useAdminExternalShops() {
  return useQuery<AdminExternalShop[]>({
    queryKey: ["admin", "external-shops"],
    queryFn: () => fetch("/api/admin/external-shops").then((r) => r.json()),
  });
}

export function useCreateExternalShop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AdminExternalShop, "_id" | "createdAt">) =>
      fetch("/api/admin/external-shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error ?? "Failed to create");
        return json;
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "external-shops"] }),
  });
}

export function useUpdateExternalShop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<AdminExternalShop> & { id: string }) =>
      fetch(`/api/admin/external-shops/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error ?? "Failed to update");
        return json;
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "external-shops"] }),
  });
}

export function useDeleteExternalShop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/external-shops/${id}`, { method: "DELETE" }).then(async (r) => {
        if (!r.ok) throw new Error("Failed to delete");
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "external-shops"] }),
  });
}
