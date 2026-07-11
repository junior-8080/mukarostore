import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BespokeRequest } from "@/lib/models/BespokeRequest";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, occasion, preferredDate, vision } = body;

  if (!name || !phone || !occasion) {
    return NextResponse.json(
      { error: "Name, phone and occasion are required" },
      { status: 400 }
    );
  }

  await connectDB();

  const request = await BespokeRequest.create({
    name,
    phone,
    occasion,
    preferredDate: preferredDate ?? "",
    vision: vision ?? "",
  });

  return NextResponse.json({ id: request._id }, { status: 201 });
}