import { useQuery } from "@tanstack/react-query";

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  byStatus: Record<string, number>;
  recentOrders: AdminOrder[];
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string; address: string };
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: string;
  createdAt: string;
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin", "stats"],
    queryFn: () => fetch("/api/admin/stats").then((r) => r.json()),
  });
}