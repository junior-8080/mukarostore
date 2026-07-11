import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export async function GET(req: NextRequest) {
  await connectDB();
  const collection = req.nextUrl.searchParams.get("collection");
  const query: Record<string, unknown> = { inStock: true };
  if (collection && collection !== "all") query.collections = collection;
  const products = await Product.find(query).sort({ createdAt: -1 });
  return NextResponse.json(products, { headers: { "Cache-Control": "no-store" } });
}