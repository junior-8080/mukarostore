import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Collection } from "@/lib/models/Collection";

export async function GET() {
  await connectDB();
  const collections = await Collection.find().sort({ order: 1 });
  return NextResponse.json(collections);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const collection = await Collection.create(body);
  return NextResponse.json(collection, { status: 201 });
}