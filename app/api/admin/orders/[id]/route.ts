import { NextRequest, NextResponse, after } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { sendSms, buildOrderSms, type OrderSmsEvent } from "@/lib/sms";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(); if (guard) return guard;
  await connectDB();
  const { id } = await params;
  const order = await Order.findById(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(); if (guard) return guard;
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  const previous = await Order.findById(id);
  if (!previous) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const order = await Order.findByIdAndUpdate(id, body, { new: true });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const statusChanged = previous.status !== order.status;
  const notifiable = order.status !== "pending";
  const smsQueued = statusChanged && notifiable && Boolean(order.customer.phone);

  if (smsQueued) {
    const message = buildOrderSms(order.status as OrderSmsEvent, {
      name: order.customer.name,
      orderNumber: order.orderNumber,
      total: order.total,
      currency: order.currency,
    });

    after(async () => {
      try {
        await sendSms(order.customer.phone, message);
      } catch (err) {
        console.error(`[SMS] Failed to send ${order.status} message:`, err);
      }
    });
  }

  return NextResponse.json({ ...order.toObject(), sms: { queued: smsQueued } });
}