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
  },
  { timestamps: true }
);

const ProductModel = models.Product || model<IProduct>("Product", ProductSchema);
// Named export for backward compat with existing admin routes
export const Product = ProductModel;
export default ProductModel;
