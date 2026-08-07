import { Schema, model, models } from "mongoose";

export interface IPromoCode {
  code: string;
  percentOff: number;
  active: boolean;
}

const PromoCodeSchema = new Schema<IPromoCode>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    percentOff: { type: Number, required: true, min: 1, max: 100 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.PromoCode || model<IPromoCode>("PromoCode", PromoCodeSchema);
