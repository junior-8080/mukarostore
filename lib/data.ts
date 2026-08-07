export type Product = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  isBundle: boolean;
  price: number;
  description: string;
  bundleContents?: string[];
  images: string[];
  popularity: number;
  createdAt: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  _id: string;
  orderNumber: string;
  items: { productId: string; name: string; price: number; qty: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customer: { name: string; phone: string; gpsAddress: string };
  paymentMethod: "MoMo" | "Card" | "Bank Transfer";
  promoCode?: string;
  status: "placed" | "processing" | "delivered";
  createdAt: string;
};

export type CategoryItem = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
};

export const DELIVERY_THRESHOLD = 200;
export const DELIVERY_FEE = 15;
export const PROMO_CODES: Record<string, number> = { MUKARO10: 10 };
