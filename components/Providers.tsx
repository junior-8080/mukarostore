"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart-context";
import QueryProvider from "@/components/QueryProvider";
import CartDrawer from "@/components/CartDrawer";

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
