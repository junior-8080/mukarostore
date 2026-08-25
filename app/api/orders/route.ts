import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/lib/models/Order";
import ProductModel from "@/lib/models/Product";
import { PROMO_CODES, DELIVERY_FEE, DELIVERY_THRESHOLD } from "@/lib/data";

function generateOrderNumber(): string {
  return `MKC-${Math.floor(10000 + Math.random() * 90000)}`;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    items: { productId: string; qty: number }[];
    customer: { name: string; phone: string; gpsAddress: string };
    paymentMethod: "MoMo" | "Card" | "Bank Transfer";
    promoCode?: string;
  };

  const { items, customer, paymentMethod, promoCode } = body;

  if (!customer?.name || !customer?.phone || !customer?.gpsAddress) {
    return NextResponse.json(
      { error: "Missing customer details" },
      { status: 400 }
    );
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Order must have at least one item" },
      { status: 400 }
    );
  }
  if (!paymentMethod) {
    return NextResponse.json(
      { error: "Payment method is required" },
      { status: 400 }
    );
  }

  await connectDB();

  // Re-fetch prices from DB (server is source of truth)
  const productIds = items.map((i) => i.productId);
  const products = await ProductModel.find({ _id: { $in: productIds } })
    .populate("externalShop", "name")
    .lean();

  const orderItems = items.map((item) => {
    const product = products.find((p) => String(p._id) === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    const shop = product.externalShop as unknown as { _id: unknown; name: string } | null;
    return {
      productId: item.productId,
      name: product.name,
      price: product.price,
      qty: item.qty,
      externalShopId: shop ? String(shop._id) : null,
      externalShopName: shop ? shop.name : null,
      commission: product.commission ?? null,
    };
  });

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const deliveryFee = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

  let discount = 0;
  if (promoCode) {
    const percentOff = PROMO_CODES[promoCode.toUpperCase()];
    if (percentOff) {
      discount = Math.round(((subtotal * percentOff) / 100) * 100) / 100;
    }
  }

  const total = subtotal + deliveryFee - discount;

  const order = await OrderModel.create({
    orderNumber: generateOrderNumber(),
    items: orderItems,
    subtotal,
    deliveryFee,
    discount,
    total,
    customer,
    paymentMethod,
    promoCode: promoCode ?? undefined,
    status: "placed",
  });

  return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
}
