export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderActions from "@/components/admin/OrderActions";

async function getOrder(id: string) {
  await connectDB();
  return Order.findById(id).lean();
}

interface DetailItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  externalShopId?: string | null;
  externalShopName?: string | null;
  commission?: number | null;
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const items = order.items as DetailItem[];

  // Amount owed to each external shop: (sale price − MukaroStore's commission) × qty,
  // using the shop/commission snapshot captured at checkout time. In-house items are excluded.
  const payoutsByShop = new Map<string, { shop: string; units: number; owed: number }>();
  for (const item of items) {
    if (!item.externalShopName) continue;
    const key = item.externalShopId ?? item.externalShopName;
    const owed = (item.price - (item.commission ?? 0)) * item.qty;
    const existing = payoutsByShop.get(key);
    if (existing) {
      existing.units += item.qty;
      existing.owed += owed;
    } else {
      payoutsByShop.set(key, { shop: item.externalShopName, units: item.qty, owed });
    }
  }
  const payouts = Array.from(payoutsByShop.values());

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-xs text-black/50 hover:text-black transition-colors mb-5 sm:mb-6"
      >
        <ArrowLeft size={13} /> Back to Orders
      </Link>

      <div className="mb-6 sm:mb-8">
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-black">{order.orderNumber}</h1>
        <p className="text-sm text-black/50 mt-1">
          {new Date(order.createdAt).toLocaleDateString("en-GH", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      {/* Customer */}
      <div className="bg-white rounded-xl border border-[#CDCAC3] p-4 sm:p-5 mb-4">
        <h2 className="font-semibold text-black mb-3">Customer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div><p className="text-black/50 text-xs mb-0.5">Name</p><p className="font-medium">{order.customer.name}</p></div>
          <div><p className="text-black/50 text-xs mb-0.5">Phone</p><p>{order.customer.phone}</p></div>
          <div className="sm:col-span-2"><p className="text-black/50 text-xs mb-0.5">GPS Address</p><p>{order.customer.gpsAddress}</p></div>
          <div><p className="text-black/50 text-xs mb-0.5">Payment Method</p><p>{order.paymentMethod}</p></div>
          {order.promoCode && (
            <div><p className="text-black/50 text-xs mb-0.5">Promo Code</p><p>{order.promoCode}</p></div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-[#CDCAC3] p-4 sm:p-5 mb-4">
        <h2 className="font-semibold text-black mb-3">Items</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#CDCAC3] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black line-clamp-1">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-black/50">Qty: {item.qty}</p>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      item.externalShopName ? "bg-amber-50 text-amber-700" : "bg-black/5 text-black/40"
                    }`}
                  >
                    {item.externalShopName ?? "In-house"}
                  </span>
                </div>
              </div>
              <p className="text-sm font-semibold text-black shrink-0">
                ₵{(item.price * item.qty).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-[#CDCAC3] mt-4 pt-4 flex justify-between font-semibold text-black">
          <span>Total</span>
          <span>₵{order.total.toLocaleString()}</span>
        </div>
      </div>

      {/* External shop payouts — internal reconciliation only, never shown to buyers */}
      {payouts.length > 0 && (
        <div className="bg-white rounded-xl border border-[#CDCAC3] p-4 sm:p-5 mb-4">
          <h2 className="font-semibold text-black mb-3">External Shop Payouts</h2>
          <div className="space-y-2.5">
            {payouts.map((p) => (
              <div key={p.shop} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-black">{p.shop}</p>
                  <p className="text-xs text-black/50">{p.units} unit{p.units !== 1 ? "s" : ""}</p>
                </div>
                <p className="font-semibold text-black">₵{p.owed.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status + notes — client component */}
      <OrderActions
        orderId={String(order._id)}
        currentStatus={order.status}
        currentNotes={order.notes ?? ""}
      />
    </div>
  );
}