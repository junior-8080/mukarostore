import { Schema, model, models } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  // Snapshot of the owning external shop + MukaroStore's commission at the time this
  // order was placed, so reconciliation stays accurate even if the product is later
  // reassigned or deleted. Null for in-house products.
  externalShopId?: string | null;
  externalShopName?: string | null;
  commission?: number | null;
}

export interface IOrder {
  orderNumber: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customer: {
    name: string;
    phone: string;
    gpsAddress: string;
  };
  paymentMethod: "MoMo";
  promoCode?: string;
  status: "placed" | "processing" | "delivered";
  // Internal admin notes — never collected from the customer at checkout.
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        externalShopId: { type: String, default: null },
        externalShopName: { type: String, default: null },
        commission: { type: Number, default: null },
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      gpsAddress: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["MoMo"],
      required: true,
    },
    promoCode: { type: String },
    status: {
      type: String,
      enum: ["placed", "processing", "delivered"],
      default: "placed",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const OrderModel = models.Order || model<IOrder>("Order", OrderSchema);
// Named export for backward compat with existing admin routes
export const Order = OrderModel;
export default OrderModel;
