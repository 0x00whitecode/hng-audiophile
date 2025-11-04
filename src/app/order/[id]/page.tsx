"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type LocalOrder = {
  id: string;
  customer: { name: string; email: string; phone: string };
  shipping: { address: string; city: string; country: string; zip: string };
  items: { id: string; name: string; price: number; quantity: number }[];
  totals: { subtotal: number; shipping: number; tax: number; grandTotal: number };
  paymentMethod?: "card" | "paypal";
  createdAt?: number;
};

export default function OrderConfirmation({ params }: { params: { id: string } }) {
  const { id } = params;
  const [order, setOrder] = useState<LocalOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTracking, setShowTracking] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      const raw = localStorage.getItem(`order:${id}`);
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, [id]);

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  const eta = useMemo(() => {
    const base = order?.createdAt || Date.now();
    const days = 3; // default estimate
    const d = new Date(base + days * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }, [order]);

  return (
    <div className="container py-16">
      <main className="grid md:grid-cols-3 gap-8" aria-busy={loading} aria-live="polite">
        {/* Confirmation + transaction details */}
        <section className="md:col-span-2 space-y-4 rounded border p-6 bg-white" aria-label="Payment confirmation">
          <header>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">Thank you for your order!</h1>
            <p className="mt-2 text-neutral-700">Order <strong>#{id}</strong> has been confirmed.</p>
            <p className="mt-1 text-neutral-700">A confirmation email was sent to {order?.customer.email ?? "your inbox"}.</p>
          </header>

          {/* Transaction details */}
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between border rounded p-3 bg-neutral-50">
              <dt className="text-neutral-600">Transaction ID</dt>
              <dd className="font-medium">{id.slice(0, 10)}</dd>
            </div>
            <div className="flex justify-between border rounded p-3 bg-neutral-50">
              <dt className="text-neutral-600">Payment Method</dt>
              <dd className="font-medium">{order?.paymentMethod ? order.paymentMethod === "card" ? "Credit Card" : "PayPal" : "—"}</dd>
            </div>
          </dl>

          {/* Order summary */}
          <section className="mt-4" aria-label="Order summary">
            <h2 className="text-lg font-semibold tracking-widest">Items</h2>
            <div className="mt-3 rounded border">
              {loading && (
                <div className="p-4 text-sm text-neutral-600">Loading your order…</div>
              )}
              {!loading && order && (
                <ul className="divide-y">
                  {order.items.map((i) => (
                    <li key={i.id} className="flex items-center justify-between p-4 text-sm">
                      <div>
                        <p className="font-medium">{i.name}</p>
                        <p className="text-neutral-600">x{i.quantity}</p>
                      </div>
                      <p className="font-semibold">{fmt.format(i.price * i.quantity)}</p>
                    </li>
                  ))}
                </ul>
              )}
              {!loading && !order && (
                <div className="p-4 text-sm text-neutral-600">We couldn’t find details for this order on this device.</div>
              )}
            </div>

            {/* Totals */}
            {order && (
              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between border rounded p-3"><span>Subtotal</span><strong>{fmt.format(order.totals.subtotal)}</strong></div>
                <div className="flex justify-between border rounded p-3"><span>Shipping</span><strong>{fmt.format(order.totals.shipping)}</strong></div>
                <div className="flex justify-between border rounded p-3"><span>Tax</span><strong>{fmt.format(order.totals.tax)}</strong></div>
                <div className="flex justify-between border rounded p-3 sm:col-span-2"><span>Grand Total</span><strong>{fmt.format(order.totals.grandTotal)}</strong></div>
              </div>
            )}
          </section>

          {/* Payment & billing */}
          <section className="mt-6 grid md:grid-cols-2 gap-6" aria-label="Payment and billing information">
            <article className="rounded border p-4">
              <h3 className="font-semibold tracking-widest">Payment Method</h3>
              <p className="mt-2 text-neutral-700 text-sm">{order?.paymentMethod ? (order.paymentMethod === "card" ? "Credit Card" : "PayPal") : "Not specified"}</p>
              <p className="mt-1 text-neutral-600 text-xs">Secure checkout with SSL and PCI compliance.</p>
            </article>
            <article className="rounded border p-4" aria-label="Billing information">
              <h3 className="font-semibold tracking-widest">Billing</h3>
              {order ? (
                <address className="not-italic mt-2 text-neutral-700 text-sm">
                  {order.customer.name}
                  <br />{order.shipping.address}
                  <br />{order.shipping.city}, {order.shipping.country} {order.shipping.zip}
                  <br />{order.customer.email} • {order.customer.phone}
                </address>
              ) : (
                <p className="mt-2 text-neutral-700 text-sm">Billing matches your shipping details.</p>
              )}
            </article>
          </section>

          {/* Shipping details */}
          <section className="mt-6 rounded border p-4" aria-label="Shipping details">
            <h3 className="font-semibold tracking-widest">Shipping</h3>
            {order ? (
              <div className="mt-2 text-neutral-700 text-sm">
                <p>{order.shipping.address}</p>
                <p>{order.shipping.city}, {order.shipping.country} {order.shipping.zip}</p>
                <p className="mt-2">Estimated delivery: <strong>{eta}</strong></p>
              </div>
            ) : (
              <p className="mt-2 text-neutral-700 text-sm">We’ll email shipping details and tracking information shortly.</p>
            )}
          </section>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary">Continue Shopping</Link>
            <button type="button" className="btn" onClick={() => setShowTracking((v) => !v)} aria-expanded={showTracking} aria-controls="tracking-panel">Track Order</button>
          </div>

          {/* Tracking panel */}
          <div id="tracking-panel" hidden={!showTracking} className="mt-3 rounded border p-4 text-sm text-neutral-700">
            <p>Tracking will be available once the courier picks up your package. We’ll email you a tracking number.</p>
          </div>
        </section>

        {/* Sidebar summary (responsive) */}
        <aside className="space-y-4 md:sticky md:top-8 h-fit" aria-label="Quick order summary">
          <h2 className="text-lg font-semibold tracking-widest">Summary</h2>
          {order ? (
            <div className="rounded border p-4 space-y-3">
              <div className="flex justify-between text-sm"><span>Items</span><span>{order.items.reduce((s, i) => s + i.quantity, 0)}</span></div>
              <div className="flex justify-between text-sm"><span>Total</span><span>{fmt.format(order.totals.grandTotal)}</span></div>
              <Link href="/" className="mt-2 inline-block btn btn-sm">Shop More</Link>
            </div>
          ) : (
            <div className="rounded border p-4 text-sm text-neutral-700">Order details will appear here once loaded.</div>
          )}
        </aside>
      </main>
    </div>
  );
}