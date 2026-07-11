import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { sendSms, buildConfirmationSms } from "@/lib/sms";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const order = await Order.findById(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  const previous = await Order.findById(id);
  if (!previous) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const order = await Order.findByIdAndUpdate(id, body, { new: true });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const justConfirmed =
    previous.status !== "confirmed" && order.status === "confirmed";

  if (justConfirmed && order.customer.phone) {
    const message = buildConfirmationSms({
      name: order.customer.name,
      orderNumber: order.orderNumber,
      total: order.total,
      currency: order.currency,
    });

    try {
      await sendSms(order.customer.phone, message);
    } catch (err) {
      console.error("[SMS] Failed to send confirmation:", err);
    }
  }

  return NextResponse.json(order);
}