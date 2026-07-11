import mongoose, { Schema, model, models } from "mongoose";

export interface IBespokeRequest {
  _id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  occasion: string;
  preferredDate?: string;
  vision?: string;
  status: "new" | "contacted" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const BespokeRequestSchema = new Schema<IBespokeRequest>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    occasion: { type: String, required: true },
    preferredDate: { type: String, default: "" },
    vision: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const BespokeRequest =
  models.BespokeRequest || model<IBespokeRequest>("BespokeRequest", BespokeRequestSchema);