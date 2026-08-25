import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import ExternalShopModel from "@/lib/models/ExternalShop";

export async function GET() {
  const guard = await requireAdmin(); if (guard) return guard;
  await connectDB();
  const shops = await ExternalShopModel.find({}).sort({ name: 1 });
  return NextResponse.json(shops);
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(); if (guard) return guard;
  await connectDB();
  const body = await req.json();
  const {
    name,
    contactPerson,
    phone,
    email,
    paymentMethod,
    momoNumber,
    bankName,
    bankAccountName,
    bankAccountNumber,
    notes,
    isActive,
  } = body;
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const existing = await ExternalShopModel.findOne({ name: name.trim() });
  if (existing) return NextResponse.json({ error: "An external shop with that name already exists" }, { status: 409 });
  const shop = await ExternalShopModel.create({
    name: name.trim(),
    contactPerson: contactPerson ?? "",
    phone: phone ?? "",
    email: email ?? "",
    paymentMethod: paymentMethod ?? "MoMo",
    momoNumber: momoNumber ?? "",
    bankName: bankName ?? "",
    bankAccountName: bankAccountName ?? "",
    bankAccountNumber: bankAccountNumber ?? "",
    notes: notes ?? "",
    isActive: isActive ?? true,
  });
  return NextResponse.json(shop, { status: 201 });
}
