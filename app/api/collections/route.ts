import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Collection } from "@/lib/models/Collection";

export async function GET() {
  await connectDB();
  const collections = await Collection.find({ active: true }).sort({ order: 1 });
  // Prepend the "All" tab which is always first
  const all = [{ id: "all", label: "All" }, ...collections.map((c) => ({ id: c.id, label: c.label }))];
  return NextResponse.json(all, { headers: { "Cache-Control": "no-store" } });
}