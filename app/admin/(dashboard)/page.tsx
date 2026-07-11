"use client";

import Link from "next/link";
import { Package, ShoppingCart, TrendingUp, Clock } from "lucide-react";
import { useAdminStats } from "@/lib/hooks/use-admin-stats";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl font-bold text-black">Dashboard</h1>
        <div className="flex gap-2 sm:gap-3">
          <Link
            href="/admin/products/new"
            className="bg-[#9B7A51] hover:bg-[#6C3D0C] text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="border border-[#CDCAC3] bg-white text-black text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-[#FEFEFD] transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-black/40 text-sm">Loading…</div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { label: "Total Products", value: stats?.totalProducts ?? 0, icon: Package, color: "text-[#9B7A51]" },
              { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingCart, color: "text-blue-500" },
              { label: "Revenue (GHS)", value: `₵${(stats?.revenue ?? 0).toLocaleString()}`, icon: TrendingUp, color: "text-green-500" },
              { label: "Pending", value: stats?.byStatus?.pending ?? 0, icon: Clock, color: "text-yellow-500" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-[#CDCAC3] p-4 sm:p-5">
                <div className={`${color} mb-2 sm:mb-3`}><Icon size={18} /></div>
                <p className="text-xl sm:text-2xl font-bold text-black">{value}</p>
                <p className="text-xs text-black/50 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Status breakdown */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-6 sm:mb-8">
            {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
              <div key={s} className="bg-white rounded-xl border border-[#CDCAC3] px-3 py-3 text-center">
                <p className="text-lg font-bold text-black">{stats?.byStatus?.[s] ?? 0}</p>
                <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[s]}`}>{s}</span>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-xl border border-[#CDCAC3]">
            <div className="px-4 sm:px-6 py-4 border-b border-[#CDCAC3]">
              <h2 className="font-semibold text-black">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[540px]">
                <thead>
                  <tr className="border-b border-[#CDCAC3]">
                    {["Order #", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-black/50 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!stats?.recentOrders?.length ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-black/40 text-sm">No orders yet</td>
                    </tr>
                  ) : (
                    stats.recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-[#CDCAC3] last:border-0 hover:bg-[#FEFEFD]">
                        <td className="px-4 sm:px-6 py-4 font-mono text-xs whitespace-nowrap">{order.orderNumber}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{order.customer?.name}</td>
                        <td className="px-4 sm:px-6 py-4">{order.items?.length}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">₵{order.total?.toLocaleString()}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-black/50 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}