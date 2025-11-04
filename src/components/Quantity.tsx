"use client";
import { useId } from "react";

export default function Quantity({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const id = useId();
  return (
    <div className="inline-flex items-center bg-neutral-200 rounded">
      <button
        type="button"
        aria-controls={id}
        aria-label="Decrease quantity"
        className="px-3 py-2 text-sm hover:bg-neutral-300 focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-l"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        -
      </button>
      <input
        id={id}
        className="w-12 text-center bg-transparent focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        min={1}
        value={value}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
        aria-label="Quantity"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        className="px-3 py-2 text-sm hover:bg-neutral-300 focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-r"
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}