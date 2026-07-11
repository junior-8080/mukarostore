import mongoose, { Schema, model, models } from "mongoose";

export interface ICollection {
  _id: mongoose.Types.ObjectId;
  id: string;
  label: string;
  order: number;
  active: boolean;
}

const CollectionSchema = new Schema<ICollection>({
  id: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
});

export const Collection = models.Collection || model<ICollection>("Collection", CollectionSchema);