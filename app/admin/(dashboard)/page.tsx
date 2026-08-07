"use client";

import Link from "next/link";
import { Package, ShoppingCart, TrendingUp, Clock } from "lucide-react";
import { useAdminStats } from "@/lib/hooks/use-admin-stats";

const STATUS_COLORS: Record<string, string> = {
  placed:     "bg-blue-50 text-blue-600",
  processing: "bg-yellow-50 text-yellow-600",
  delivered:  "bg-green-50 text-green-600",
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-8">
        <div>
          <p className="text-[10px] text-gray-muted font-body uppercase tracking-widest mb-1">Overview</p>
          <h1 className="font-heading font-bold text-2xl text-brand-navy">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products/new"
            className="bg-brand-navy text-white text-xs font-body font-medium px-4 py-2 hover:opacity-90 transition-opacity"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="border border-gray-card bg-white text-brand-navy text-xs font-body font-medium px-4 py-2 hover:bg-gray-light transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-muted text-sm py-12 text-center font-body">Loading…</div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Total Products", value: stats?.totalProducts ?? 0, icon: Package },
              { label: "Total Orders",   value: stats?.totalOrders   ?? 0, icon: ShoppingCart },
              { label: "Revenue (GHS)",  value: `₵${(stats?.revenue ?? 0).toLocaleString()}`, icon: TrendingUp },
              { label: "Processing",     value: stats?.byStatus?.processing ?? 0, icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white border border-gray-card p-5">
                <Icon size={16} className="text-gray-muted mb-3" strokeWidth={1.75} />
                <p className="font-heading font-bold text-2xl text-brand-navy">{value}</p>
                <p className="text-xs font-body text-gray-muted mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Status breakdown */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {(["placed", "processing", "delivered"] as const).map((s) => (
              <div key={s} className="bg-white border border-gray-card px-4 py-4 text-center">
                <p className="font-heading font-bold text-xl text-brand-navy">{stats?.byStatus?.[s] ?? 0}</p>
                <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 font-body font-medium capitalize ${STATUS_COLORS[s]}`}>
                  {s}
                </span>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="bg-white border border-gray-card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-card flex items-center justify-between">
              <p className="font-heading font-semibold text-brand-navy text-sm">Recent Orders</p>
              <Link href="/admin/orders" className="text-xs font-body text-brand-gold hover:underline">
                View all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[540px]">
                <thead>
                  <tr className="border-b border-gray-card">
                    {["Order #", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] font-body text-gray-muted uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!stats?.recentOrders?.length ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-gray-muted text-sm font-body">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    stats.recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-card last:border-0 hover:bg-gray-light transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-brand-navy whitespace-nowrap">{order.orderNumber}</td>
                        <td className="px-5 py-4 font-body text-brand-navy whitespace-nowrap">{order.customer?.name}</td>
                        <td className="px-5 py-4 font-body text-gray-muted">{order.items?.length}</td>
                        <td className="px-5 py-4 font-body text-brand-navy whitespace-nowrap">₵{order.total?.toLocaleString()}</td>
                        <td className="px-5 py-4">
                          <span className={`text-[10px] px-2 py-0.5 font-body font-medium capitalize whitespace-nowrap ${STATUS_COLORS[order.status] ?? "bg-gray-card text-gray-muted"}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-muted text-xs font-body whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
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
