import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/lib/models/Product";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "popularity";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") ?? "8", 10));

  const query: Record<string, unknown> = {};
  if (category && category !== "All Products") {
    query.category = category;
  }

  let sortOption: Record<string, 1 | -1> = { popularity: -1 };
  if (sort === "newest") sortOption = { createdAt: -1 };
  else if (sort === "price-asc") sortOption = { price: 1 };
  else if (sort === "price-desc") sortOption = { price: -1 };

  const total = await ProductModel.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  const products = await ProductModel.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json(
    { products, total, page, totalPages },
    { headers: { "Cache-Control": "no-store" } }
  );
}
