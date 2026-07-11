"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAdminOrders } from "@/lib/hooks/use-admin-orders";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUSES = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

function OrdersContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? undefined;

  const { data: orders = [], isLoading } = useAdminOrders(status);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-black mb-5 sm:mb-6">Orders</h1>

      <div className="flex gap-2 mb-5 sm:mb-6 flex-wrap">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin/orders" : `/admin/orders?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
              (s === "all" && !status) || status === s
                ? "bg-[#9B7A51] border-[#9B7A51] text-white"
                : "border-[#CDCAC3] text-black/60 bg-white hover:border-[#9B7A51]"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {isLoading ? (
        <div className="text-black/40 text-sm py-12 text-center">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#CDCAC3] px-5 py-12 text-center text-black/40 text-sm">
          No orders found.
        </div>
      ) : (
        <>
          {/* Card list — mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl border border-[#CDCAC3] p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-mono text-xs text-black/60">{order.orderNumber}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize shrink-0 ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <p className="font-medium text-black text-sm">{order.customer.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm font-semibold text-black">₵{order.total.toLocaleString()}</p>
                  <p className="text-xs text-black/50">{order.items.length} item{order.items.length !== 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <Link
                  href={`/admin/orders/${order._id}`}
                  className="mt-3 block text-center text-xs font-medium text-[#9B7A51] border border-[#9B7A51]/30 rounded-lg py-1.5 hover:bg-[#9B7A51]/5 transition-colors"
                >
                  View details →
                </Link>
              </div>
            ))}
          </div>

          {/* Table — tablet/desktop */}
          <div className="hidden md:block bg-white rounded-xl border border-[#CDCAC3] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#CDCAC3]">
                    {["Order #", "Customer", "Items", "Total", "Status", "Date", ""].map((h, i) => (
                      <th key={i} className="text-left px-5 py-3 text-xs font-medium text-black/50 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-[#CDCAC3] last:border-0 hover:bg-[#FEFEFD]">
                      <td className="px-5 py-4 font-mono text-xs whitespace-nowrap">{order.orderNumber}</td>
                      <td className="px-5 py-4 font-medium text-black whitespace-nowrap">{order.customer.name}</td>
                      <td className="px-5 py-4 text-black/60">{order.items.length}</td>
                      <td className="px-5 py-4 whitespace-nowrap">₵{order.total.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize whitespace-nowrap ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                      </td>
                      <td className="px-5 py-4 text-black/50 text-xs whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <Link href={`/admin/orders/${order._id}`} className="text-xs text-[#9B7A51] hover:underline whitespace-nowrap">View →</Link>
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