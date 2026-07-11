import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";

export async function GET() {
  await connectDB();

  const [totalProducts, totalOrders, statusCounts, revenueData, recentOrders] =
    await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(10),
    ]);

  const revenue = revenueData[0]?.total ?? 0;
  const byStatus = Object.fromEntries(
    statusCounts.map((s: { _id: string; count: number }) => [s._id, s.count])
  );

  return NextResponse.json({ totalProducts, totalOrders, revenue, byStatus, recentOrders });
}