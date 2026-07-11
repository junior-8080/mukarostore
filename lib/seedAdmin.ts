import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import { Admin } from "./models/Admin";

export async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  await connectDB();

  const existing = await Admin.findOne({ email });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ email, passwordHash });
}