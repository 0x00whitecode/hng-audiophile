"use client";
import { createContext, useContext, useMemo, useState } from "react";
import type { CartItem, OrderTotals } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, q: number) => void;
  clear: () => void;
  totals: OrderTotals;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (item: CartItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const setQuantity = (id: string, q: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: q } : i)));

  const clear = () => setItems([]);

  const totals = useMemo<OrderTotals>(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const tax = Math.round(subtotal * 0.1);
    return { subtotal, shipping, tax, grandTotal: subtotal + shipping + tax };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, add, remove, setQuantity, clear, totals }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}