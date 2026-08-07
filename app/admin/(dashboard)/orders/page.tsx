"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAdminOrders } from "@/lib/hooks/use-admin-orders";

const STATUS_COLORS: Record<string, string> = {
  placed:     "bg-blue-50 text-blue-600",
  processing: "bg-yellow-50 text-yellow-600",
  delivered:  "bg-green-50 text-green-600",
};

const STATUSES = ["all", "placed", "processing", "delivered"];

function OrdersContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? undefined;
  const { data: orders = [], isLoading } = useAdminOrders(status);

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] text-gray-muted font-body uppercase tracking-widest mb-1">Manage</p>
        <h1 className="font-heading font-bold text-2xl text-brand-navy">Orders</h1>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {STATUSES.map((s) => {
          const active = (s === "all" && !status) || status === s;
          return (
            <Link
              key={s}
              href={s === "all" ? "/admin/orders" : `/admin/orders?status=${s}`}
              className={`px-4 py-1.5 text-xs font-body font-medium border transition-colors capitalize ${
                active
                  ? "bg-brand-navy border-brand-navy text-white"
                  : "border-gray-card text-gray-muted bg-white hover:border-brand-navy hover:text-brand-navy"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      {isLoading ? (
        <div className="text-gray-muted text-sm py-12 text-center font-body">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-card px-5 py-12 text-center text-gray-muted text-sm font-body">
          No orders found.
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-mono text-xs text-gray-muted">{order.orderNumber}</p>
                  <span className={`text-[10px] px-2 py-0.5 font-body font-medium capitalize shrink-0 ${STATUS_COLORS[order.status] ?? "bg-gray-card text-gray-muted"}`}>
                    {order.status}
                  </span>
                </div>
                <p className="font-heading font-semibold text-brand-navy text-sm">{order.customer.name}</p>
                <p className="text-xs font-body text-gray-muted mt-0.5">{order.customer.phone}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="font-heading font-bold text-brand-navy">₵{order.total.toLocaleString()}</p>
                  <p className="text-xs text-gray-muted font-body">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/admin/orders/${order._id}`}
                  className="mt-3 block text-center text-xs font-body font-medium text-brand-gold border border-brand-gold/30 py-2 hover:bg-brand-gold/5 transition-colors"
                >
                  View details →
                </Link>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white border border-gray-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-card">
                    {["Order #", "Customer", "Phone", "Items", "Total", "Status", "Date", ""].map((h, i) => (
                      <th key={i} className="text-left px-5 py-3 text-[10px] font-body text-gray-muted uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-card last:border-0 hover:bg-gray-light transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-brand-navy whitespace-nowrap">{order.orderNumber}</td>
                      <td className="px-5 py-4 font-body font-medium text-brand-navy whitespace-nowrap">{order.customer.name}</td>
                      <td className="px-5 py-4 font-body text-gray-muted whitespace-nowrap">{order.customer.phone}</td>
                      <td className="px-5 py-4 font-body text-gray-muted">{order.items.length}</td>
                      <td className="px-5 py-4 font-heading font-semibold text-brand-navy whitespace-nowrap">₵{order.total.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] px-2 py-0.5 font-body font-medium capitalize whitespace-nowrap ${STATUS_COLORS[order.status] ?? "bg-gray-card text-gray-muted"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-muted text-xs font-body whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/admin/orders/${order._id}`} className="text-xs font-body text-brand-gold hover:underline whitespace-nowrap">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}
