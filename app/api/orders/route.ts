import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `DC-${ts}-${rand}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer, items, total, notes } = body;

  if (!customer?.name || !customer?.phone || !customer?.address) {
    return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Order must have at least one item" }, { status: 400 });
  }
  if (typeof total !== "number" || total <= 0) {
    return NextResponse.json({ error: "Invalid total" }, { status: 400 });
  }

  await connectDB();

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customer: {
      name: customer.name,
      email: customer.email ?? "",
      phone: customer.phone,
      address: customer.address,
    },
    items,
    total,
    notes: notes ?? "",
  });

  return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
}