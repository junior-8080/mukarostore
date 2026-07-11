import type { NextAuthConfig } from "next-auth";

// Edge-compatible config — no Node.js-only imports (mongoose, bcrypt, etc.)
export const authConfig: NextAuthConfig = {
  providers: [],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
};