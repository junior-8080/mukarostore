import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CategoryModel from "@/lib/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await CategoryModel.find({}).sort({ order: 1, name: 1 }).lean();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json([]);
  }
}
