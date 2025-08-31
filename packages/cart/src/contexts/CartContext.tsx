"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCart } from "../hooks/useCart";

const CartContext = createContext<ReturnType<typeof useCart> | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cartState = useCart();

  return (
    <CartContext.Provider value={cartState}>{children}</CartContext.Provider>
  );
}

export function useCartContext(): ReturnType<typeof useCart> {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
