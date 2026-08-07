"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart-context";
import QueryProvider from "@/components/QueryProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>
        <CartProvider>{children}</CartProvider>
      </SessionProvider>
    </QueryProvider>
  );
}
