import mongoose, { Schema, model, models } from "mongoose";

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  category: string;
  isBundle: boolean;
  price: number;
  description: string;
  bundleContents?: string[];
  images: string[];
  popularity: number;
  // Internal only — the external shop that owns/supplies this product, and MukaroStore's
  // cut per unit sold (the shop is owed price − commission). Never expose to buyers.
  externalShop?: mongoose.Types.ObjectId | null;
  commission?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    isBundle: { type: Boolean, default: false },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    bundleContents: { type: [String], default: undefined },
    images: { type: [String], default: [] },
    popularity: { type: Number, default: 50 },
    externalShop: { type: Schema.Types.ObjectId, ref: "ExternalShop", default: null },
    commission: { type: Number, default: null },
  },
  { timestamps: true }
);

const ProductModel = models.Product || model<IProduct>("Product", ProductSchema);
// Named export for backward compat with existing admin routes
export const Product = ProductModel;
export default ProductModel;
