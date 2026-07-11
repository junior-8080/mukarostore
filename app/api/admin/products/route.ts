import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { slugify } from "@/lib/slug";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = req.nextUrl;
  const collection = searchParams.get("collection");
  const search = searchParams.get("search");

  const query: Record<string, unknown> = {};
  if (collection) query.collections = collection;
  if (search) query.name = { $regex: search, $options: "i" };

  const products = await Product.find(query).sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const slug = slugify(body.name);

  const existing = await Product.findOne({ slug });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const product = await Product.create({ ...body, slug: finalSlug });
  return NextResponse.json(product, { status: 201 });
}