import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string; address: string };
  items: { productId: string; name: string; price: number; qty: number; image: string }[];
  total: number;
  currency: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  createdAt: string;
}

export function useAdminOrders(status?: string) {
  return useQuery<AdminOrder[]>({
    queryKey: ["admin", "orders", status ?? "all"],
    queryFn: () => {
      const sp = status && status !== "all" ? `?status=${status}` : "";
      return fetch(`/api/admin/orders${sp}`).then((r) => r.json());
    },
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string; notes: string } }) =>
      fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}