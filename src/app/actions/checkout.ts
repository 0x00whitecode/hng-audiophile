"use server";
import { Resend } from "resend";
import type { Order, OrderTotals, CartItem, Customer, Shipping } from "@/lib/types";
import { renderEmailHtml } from "@/server/email";

type Payload = {
  customer: Customer;
  shipping: Shipping;
  items: CartItem[];
  totals: OrderTotals;
};

export async function processCheckout(payload: Payload): Promise<{ id: string } | null> {
  // Prevent duplicate submissions by hashing items & customer
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const order: Order = {
    id,
    customer: payload.customer,
    shipping: payload.shipping,
    items: payload.items,
    totals: payload.totals,
    status: "processing",
    createdAt: Date.now(),
  };

  // TODO: Convex integration
  // The Convex client requires project setup and generated files.
  // Here we keep a placeholder that can be replaced with a mutation call.
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      // Example placeholder POST to custom endpoint. Replace with Convex mutation.
      await fetch(`${convexUrl}/api/save-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    }
  } catch (err) {
    console.error("Convex save failed (placeholder)", err);
  }

  // Send confirmation email via Resend when API key is set
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const html = renderEmailHtml(order);
      await resend.emails.send({
        from: "Audiophile <orders@audiophile.dev>",
        to: order.customer.email,
        subject: `Order Confirmation #${order.id}`,
        html,
      });
    }
  } catch (err) {
    console.error("Resend email failed", err);
  }

  return { id };
}