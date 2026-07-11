export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderActions from "@/components/admin/OrderActions";

async function getOrder(id: string) {
  await connectDB();
  return Order.findById(id).lean();
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

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
          <div><p className="text-black/50 text-xs mb-0.5">Email</p><p className="break-all">{order.customer.email || "—"}</p></div>
          <div><p className="text-black/50 text-xs mb-0.5">Address</p><p>{order.customer.address}</p></div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-[#CDCAC3] p-4 sm:p-5 mb-4">
        <h2 className="font-semibold text-black mb-3">Items</h2>
        <div className="space-y-3">
          {(order.items as Array<{ image: string; name: string; qty: number; price: number }>).map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.image ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0 bg-[#CDCAC3]">
                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[#CDCAC3] flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black line-clamp-1">{item.name}</p>
                <p className="text-xs text-black/50">Qty: {item.qty}</p>
              </div>
              <p className="text-sm font-semibold text-black shrink-0">
                ₵{(item.price * item.qty).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-[#CDCAC3] mt-4 pt-4 flex justify-between font-semibold text-black">
          <span>Total</span>
          <span>₵{order.total.toLocaleString()} {order.currency}</span>
        </div>
      </div>

      {/* Status + notes — client component */}
      <OrderActions
        orderId={String(order._id)}
        currentStatus={order.status}
        currentNotes={order.notes ?? ""}
      />
    </div>
  );
}