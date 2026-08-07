import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/lib/models/Order";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  await connectDB();
  const { orderNumber } = await params;

  const order = await OrderModel.findOne({ orderNumber }).lean();
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
