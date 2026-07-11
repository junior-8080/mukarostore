import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./lib/mongodb";
import { Admin } from "./lib/models/Admin";
import { ensureAdmin } from "./lib/seedAdmin";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        await ensureAdmin();
        await connectDB();

        const admin = await Admin.findOne({ email });
        if (!admin) return null;

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) return null;

        return { id: "admin", name: "Admin", email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});