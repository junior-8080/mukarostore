import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { slugify } from "@/lib/slug";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(); if (guard) return guard;
  await connectDB();
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const query: Record<string, unknown> = {};
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: "i" };
  const products = await Product.find(query).sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(); if (guard) return guard;
  await connectDB();
  const body = await req.json();
  const slug = slugify(body.name);
  const existing = await Product.findOne({ slug });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
  const product = await Product.create({ ...body, slug: finalSlug });
  return NextResponse.json(product, { status: 201 });
}
