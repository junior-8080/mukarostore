import mongoose, { Schema, model, models } from "mongoose";

export interface IExternalShop {
  _id: mongoose.Types.ObjectId;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  paymentMethod: "MoMo" | "Bank Transfer";
  momoNumber?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExternalShopSchema = new Schema<IExternalShop>(
  {
    name:               { type: String, required: true, unique: true, trim: true },
    contactPerson:      { type: String, default: "" },
    phone:              { type: String, default: "" },
    email:              { type: String, default: "" },
    paymentMethod:      { type: String, enum: ["MoMo", "Bank Transfer"], default: "MoMo" },
    momoNumber:         { type: String, default: "" },
    bankName:           { type: String, default: "" },
    bankAccountName:    { type: String, default: "" },
    bankAccountNumber:  { type: String, default: "" },
    notes:              { type: String, default: "" },
    isActive:           { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ExternalShopModel = models.ExternalShop || model<IExternalShop>("ExternalShop", ExternalShopSchema);
export default ExternalShopModel;
