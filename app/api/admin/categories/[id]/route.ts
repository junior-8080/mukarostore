import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import CategoryModel from "@/lib/models/Category";

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(); if (guard) return guard;
  await connectDB();
  const { id } = await params;
  const { name, description, image, order } = await req.json();
  const update: Record<string, unknown> = { description, image, order };
  if (name?.trim()) { update.name = name.trim(); update.slug = toSlug(name.trim()); }
  const category = await CategoryModel.findByIdAndUpdate(id, update, { new: true });
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(category);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(); if (guard) return guard;
  await connectDB();
  const { id } = await params;
  const category = await CategoryModel.findById(id);
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await category.deleteOne();
  return NextResponse.json({ success: true });
}
