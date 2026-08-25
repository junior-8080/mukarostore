"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { Product } from "./data";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = CartItem[];

type CartAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "LOAD"; items: CartState };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((i) => i.product._id === action.product._id);
      if (existing) {
        return state.map((i) =>
          i.product._id === action.product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...state, { product: action.product, quantity: 1 }];
    }
    case "REMOVE":
      return state.filter((i) => i.product._id !== action.id);
    case "SET_QTY":
      if (action.quantity <= 0)
        return state.filter((i) => i.product._id !== action.id);
      return state.map((i) =>
        i.product._id === action.id ? { ...i, quantity: action.quantity } : i
      );
    case "CLEAR":
      return [];
    case "LOAD":
      return action.items;
    default:
      return state;
  }
}

const STORAGE_KEY = "mukaro-cart";

type CartContextType = {
  items: CartState;
  add: (product: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as CartState;
          dispatch({ type: "LOAD", items: parsed });
        }
      } catch {
        // ignore parse errors
      }
      setHydrated(true);
    }
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (hydrated && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore storage errors
      }
    }
  }, [items, hydrated]);

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        add: (product) => {
          dispatch({ type: "ADD", product });
          setCartOpen(true);
        },
        remove: (id) => dispatch({ type: "REMOVE", id }),
        setQty: (id, quantity) => dispatch({ type: "SET_QTY", id, quantity }),
        clear: () => dispatch({ type: "CLEAR" }),
        subtotal,
        count,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
