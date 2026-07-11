"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";
import QueryProvider from "@/components/QueryProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </SessionProvider>
    </QueryProvider>
  );
}