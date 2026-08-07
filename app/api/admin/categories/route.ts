import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import CategoryModel from "@/lib/models/Category";

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function GET() {
  const guard = await requireAdmin(); if (guard) return guard;
  await connectDB();
  const categories = await CategoryModel.find({}).sort({ order: 1, name: 1 });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(); if (guard) return guard;
  await connectDB();
  const body = await req.json();
  const { name, description, image, order } = body;
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const slug = toSlug(name.trim());
  const existing = await CategoryModel.findOne({ slug });
  if (existing) return NextResponse.json({ error: "A category with that name already exists" }, { status: 409 });
  const category = await CategoryModel.create({ name: name.trim(), slug, description: description ?? "", image: image ?? "", order: order ?? 0 });
  return NextResponse.json(category, { status: 201 });
}
