"use client";

import {
  createContext,
  useContext,
  useReducer,
  useState,
  ReactNode,
} from "react";
import type { Product } from "./data";

export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
};

type CartState = CartItem[];

type CartAction =
  | { type: "ADD"; product: Product; size: string }
  | { type: "REMOVE"; id: string; size: string }
  | { type: "SET_QTY"; id: string; size: string; quantity: number }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(
        (i) => i.product._id === action.product._id && i.size === action.size
      );
      if (existing) {
        return state.map((i) =>
          i.product._id === action.product._id && i.size === action.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...state, { product: action.product, quantity: 1, size: action.size }];
    }
    case "REMOVE":
      return state.filter(
        (i) => !(i.product._id === action.id && i.size === action.size)
      );
    case "SET_QTY":
      if (action.quantity <= 0)
        return state.filter(
          (i) => !(i.product._id === action.id && i.size === action.size)
        );
      return state.map((i) =>
        i.product._id === action.id && i.size === action.size
          ? { ...i, quantity: action.quantity }
          : i
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

type CartContextType = {
  items: CartState;
  add: (product: Product, size: string) => void;
  remove: (id: string, size: string) => void;
  setQty: (id: string, size: string, qty: number) => void;
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

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        add: (product, size) => dispatch({ type: "ADD", product, size }),
        remove: (id, size) => dispatch({ type: "REMOVE", id, size }),
        setQty: (id, size, quantity) =>
          dispatch({ type: "SET_QTY", id, size, quantity }),
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