import mongoose, { Schema, model, models } from "mongoose";

export interface ICategory {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name:        { type: String, required: true, unique: true, trim: true },
    slug:        { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    image:       { type: String, default: "" },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CategoryModel = models.Category || model<ICategory>("Category", CategorySchema);
export default CategoryModel;
