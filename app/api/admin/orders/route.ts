import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

export async function GET(req: NextRequest) {
  await connectDB();
  const status = req.nextUrl.searchParams.get("status");
  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  const orders = await Order.find(query).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}