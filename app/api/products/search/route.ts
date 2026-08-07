import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/lib/models/Product";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "8", 10), 50);

  if (q.length < 2) return NextResponse.json([]);

  try {
    await connectDB();

    const regex = { $regex: q, $options: "i" };
    const isNumber = !isNaN(parseFloat(q)) && q !== "";

    const conditions: object[] = [
      { name: regex },
      { description: regex },
      { bundleContents: regex },
      { category: regex },
    ];
    if (isNumber) conditions.push({ price: parseFloat(q) });

    const products = await ProductModel.find({ $or: conditions })
      .sort({ popularity: -1 })
      .limit(limit)
      .select("name slug category price images isBundle popularity")
      .lean();

    return NextResponse.json(products);
  } catch {
    return NextResponse.json([]);
  }
}
