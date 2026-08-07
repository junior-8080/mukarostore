import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/lib/models/Product";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();
  const { slug } = await params;

  // Support both slug-based lookup and legacy ID-based lookup
  let product;
  if (Types.ObjectId.isValid(slug)) {
    product = await ProductModel.findById(slug).lean();
    if (product) {
      // Legacy ID lookup — return product directly (no related)
      return NextResponse.json(product, {
        headers: { "Cache-Control": "no-store" },
      });
    }
  }

  product = await ProductModel.findOne({ slug }).lean();
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const related = await ProductModel.find({
    category: product.category,
    slug: { $ne: slug },
  })
    .sort({ popularity: -1 })
    .limit(4)
    .lean();

  return NextResponse.json(
    { product, related },
    { headers: { "Cache-Control": "no-store" } }
  );
}
