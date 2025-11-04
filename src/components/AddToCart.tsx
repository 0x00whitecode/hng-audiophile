"use client";
import { useState } from "react";
import { useCart } from "@/context/cart";
import Quantity from "@/components/Quantity";

export default function AddToCart({ id, name, price }: { id: string; name: string; price: number }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="mt-6 flex items-center gap-4">
      <Quantity value={qty} onChange={setQty} />
      <button
        className="bg-primary text-white px-6 py-3 uppercase tracking-widest rounded"
        onClick={() => add({ id, name, price, quantity: qty })}
      >
        Add to Cart
      </button>
    </div>
  );
}