import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Collection } from "@/lib/models/Collection";
import { Product } from "@/lib/models/Product";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const col = await Collection.findByIdAndUpdate(id, body, { new: true });
  if (!col) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(col);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const col = await Collection.findById(id);
  if (!col) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const count = await Product.countDocuments({ collections: col.id });
  if (count > 0) {
    return NextResponse.json(
      { error: `Cannot delete — ${count} product(s) reference this collection` },
      { status: 400 }
    );
  }

  await col.deleteOne();
  return NextResponse.json({ success: true });
}