import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import ExternalShopModel from "@/lib/models/ExternalShop";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(); if (guard) return guard;
  await connectDB();
  const { id } = await params;
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
  } = await req.json();
  const update: Record<string, unknown> = {
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
  };
  if (name?.trim()) update.name = name.trim();
  const shop = await ExternalShopModel.findByIdAndUpdate(id, update, { new: true });
  if (!shop) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(shop);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(); if (guard) return guard;
  await connectDB();
  const { id } = await params;
  const shop = await ExternalShopModel.findById(id);
  if (!shop) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await shop.deleteOne();
  return NextResponse.json({ success: true });
}
