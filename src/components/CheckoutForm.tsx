"use client";
import { useCart } from "@/context/cart";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { processCheckout } from "@/app/actions/checkout";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const schema = z.object({
  name: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Invalid"),
  address: z.string().min(4, "Required"),
  zip: z.string().min(3, "Invalid"),
  city: z.string().min(2, "Required"),
  country: z.string().min(2, "Required"),
});

type FormData = z.infer<typeof schema>;

type Step = "shipping" | "payment" | "review";

type PaymentMethod = "card" | "paypal";

export default function CheckoutForm() {
  const router = useRouter();
  const { items, totals, clear } = useCart();

  // Step handling
  const [step, setStep] = useState<Step>("shipping");

  // Promo code / discount
  const [promo, setPromo] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  // Payment
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [paymentErrors, setPaymentErrors] = useState<{ number?: string; expiry?: string; cvc?: string } | null>(null);

  // Save info
  const [saveInfo, setSaveInfo] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Prefill saved shipping info
  useEffect(() => {
    try {
      const raw = localStorage.getItem("checkoutShipping");
      if (raw) {
        const data = JSON.parse(raw) as Partial<FormData>;
        Object.entries(data).forEach(([k, v]) => {
          if (typeof v === "string") setValue(k as keyof FormData, v);
        });
      }
    } catch {}
  }, [setValue]);

  const appliedTotals = useMemo(() => {
    const grand = Math.max(0, totals.grandTotal - discount);
    return { ...totals, grandTotal: grand };
  }, [totals, discount]);

  const applyPromo = () => {
    setPromoError(null);
    const code = promo.trim().toUpperCase();
    if (!code) return;
    if (code === "SAVE10") {
      setDiscount(Math.round(totals.subtotal * 0.1));
    } else if (code === "FREESHIP") {
      setDiscount(totals.shipping);
    } else {
      setDiscount(0);
      setPromoError("Invalid promo code");
    }
  };

  const validatePayment = (): boolean => {
    if (method === "paypal") return true;
    const errs: { number?: string; expiry?: string; cvc?: string } = {};
    const num = card.number.replace(/\s+/g, "");
    if (!/^\d{13,19}$/.test(num)) errs.number = "Enter a valid card number";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) errs.expiry = "Use MM/YY format";
    if (!/^\d{3,4}$/.test(card.cvc)) errs.cvc = "CVC must be 3–4 digits";
    setPaymentErrors(Object.keys(errs).length ? errs : null);
    return Object.keys(errs).length === 0;
  };

  const goToPayment = () => {
    // Validate shipping form before moving on
    const shippingValid = schema.safeParse(getValues());
    if (!shippingValid.success) return;
    if (saveInfo) {
      try {
        localStorage.setItem("checkoutShipping", JSON.stringify(getValues()));
      } catch {}
    }
    setStep("payment");
  };

  const goToReview = () => {
    if (validatePayment()) setStep("review");
  };

  const placeOrder = async (data: FormData) => {
    if (items.length === 0) return;
    const res = await processCheckout({
      customer: { name: data.name, email: data.email, phone: data.phone },
      shipping: { address: data.address, city: data.city, country: data.country, zip: data.zip },
      items,
      totals: appliedTotals,
    });
    if (res?.id) {
      // Persist local order snapshot for confirmation page details
      try {
        const localOrder = {
          id: res.id,
          customer: { name: data.name, email: data.email, phone: data.phone },
          shipping: { address: data.address, city: data.city, country: data.country, zip: data.zip },
          items,
          totals: appliedTotals,
          paymentMethod: method,
          createdAt: Date.now(),
        };
        localStorage.setItem(`order:${res.id}`, JSON.stringify(localOrder));
        localStorage.setItem("lastOrderId", res.id);
      } catch {}
      clear();
      router.push(`/order/${res.id}`);
    }
  };

  // Progress indicator
  const Stepper = () => (
    <ol className="flex items-center gap-4 text-xs uppercase tracking-widest">
      {[
        { id: "shipping", label: "Shipping" },
        { id: "payment", label: "Payment" },
        { id: "review", label: "Review" },
      ].map((s, idx) => (
        <li key={s.id} className="flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-full border transition-colors ${
              step === s.id ? "bg-primary text-white border-primary" : "border-neutral-400 text-neutral-700"
            }`}
            aria-current={step === s.id ? "step" : undefined}
          >
            {idx + 1}
          </span>
          <span className={`${step === s.id ? "font-semibold" : "text-neutral-600"}`}>{s.label}</span>
          {idx < 2 && <span className="w-8 h-px bg-neutral-300" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );

  return (
    <form onSubmit={handleSubmit(placeOrder)} className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <Stepper />

        {/* Security & trust */}
        <div className="flex items-center gap-4 text-xs text-neutral-700">
          <span className="inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" stroke="currentColor"/></svg>
            SSL Secure
          </span>
          <span>PCI Compliant</span>
          <span>30‑day Guarantee</span>
        </div>

        {/* Shipping step */}
        {step === "shipping" && (
          <section className="space-y-4 rounded border p-4">
            <h2 className="text-lg font-semibold tracking-widest">Shipping Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block text-sm">Name
                <input {...register("name")} aria-describedby={errors.name ? "err-name" : undefined} className={`mt-1 w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors ${errors.name ? "border-red-600" : "border-neutral-300"}`} />
                {errors.name && <p id="err-name" className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
              </label>
              <label className="block text-sm">Email
                <input {...register("email")} type="email" aria-describedby={errors.email ? "err-email" : undefined} className={`mt-1 w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors ${errors.email ? "border-red-600" : "border-neutral-300"}`} />
                {errors.email && <p id="err-email" className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
              </label>
              <label className="block text-sm md:col-span-2">Phone
                <input {...register("phone")} aria-describedby={errors.phone ? "err-phone" : undefined} className={`mt-1 w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors ${errors.phone ? "border-red-600" : "border-neutral-300"}`} />
                {errors.phone && <p id="err-phone" className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
              </label>
              <label className="block text-sm md:col-span-2">Address
                <input {...register("address")} aria-describedby={errors.address ? "err-address" : undefined} className={`mt-1 w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors ${errors.address ? "border-red-600" : "border-neutral-300"}`} />
                {errors.address && <p id="err-address" className="text-red-600 text-xs mt-1">{errors.address.message}</p>}
              </label>
              <label className="block text-sm">ZIP Code
                <input {...register("zip")} aria-describedby={errors.zip ? "err-zip" : undefined} className={`mt-1 w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors ${errors.zip ? "border-red-600" : "border-neutral-300"}`} />
                {errors.zip && <p id="err-zip" className="text-red-600 text-xs mt-1">{errors.zip.message}</p>}
              </label>
              <label className="block text-sm">City
                <input {...register("city")} aria-describedby={errors.city ? "err-city" : undefined} className={`mt-1 w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors ${errors.city ? "border-red-600" : "border-neutral-300"}`} />
                {errors.city && <p id="err-city" className="text-red-600 text-xs mt-1">{errors.city.message}</p>}
              </label>
              <label className="block text-sm">Country
                <select {...register("country")} aria-describedby={errors.country ? "err-country" : undefined} className={`mt-1 w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors ${errors.country ? "border-red-600" : "border-neutral-300"}`} defaultValue="">
                  <option value="" disabled>Select country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                </select>
                {errors.country && <p id="err-country" className="text-red-600 text-xs mt-1">{errors.country.message}</p>}
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} />
              Save my shipping information for future purchases
            </label>
            <div className="flex gap-3">
              <button type="button" className="btn transition-transform hover:-translate-y-0.5 active:translate-y-px" onClick={() => router.push("/")}>Back to Home</button>
              <button type="button" className="btn btn-primary transition-transform hover:-translate-y-0.5 active:translate-y-px" onClick={goToPayment}>
                Continue to Payment
              </button>
            </div>
          </section>
        )}

        {/* Payment step */}
        {step === "payment" && (
          <section className="space-y-4 rounded border p-4">
            <h2 className="text-lg font-semibold tracking-widest">Payment Method</h2>
            <div className="grid gap-3">
              <label className="flex items-center gap-3 text-sm cursor-pointer hover:opacity-90">
                <input type="radio" name="payment" checked={method === "card"} onChange={() => setMethod("card")} />
                Credit Card
              </label>
              <label className="flex items-center gap-3 text-sm cursor-pointer hover:opacity-90">
                <input type="radio" name="payment" checked={method === "paypal"} onChange={() => setMethod("paypal")} />
                PayPal
              </label>
            </div>

            {method === "card" && (
              <div className="grid md:grid-cols-3 gap-4">
                <label className="block text-sm md:col-span-2">Card Number
                  <input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value })}
                    className={`mt-1 w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors ${paymentErrors?.number ? "border-red-600" : "border-neutral-300"}`}
                  />
                  {paymentErrors?.number && <p className="text-red-600 text-xs mt-1">{paymentErrors.number}</p>}
                </label>
                <label className="block text-sm">Expiry (MM/YY)
                  <input
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                    className={`mt-1 w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors ${paymentErrors?.expiry ? "border-red-600" : "border-neutral-300"}`}
                  />
                  {paymentErrors?.expiry && <p className="text-red-600 text-xs mt-1">{paymentErrors.expiry}</p>}
                </label>
                <label className="block text-sm">CVC
                  <input
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    value={card.cvc}
                    onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                    className={`mt-1 w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors ${paymentErrors?.cvc ? "border-red-600" : "border-neutral-300"}`}
                  />
                  {paymentErrors?.cvc && <p className="text-red-600 text-xs mt-1">{paymentErrors.cvc}</p>}
                </label>
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" className="btn transition-transform hover:-translate-y-0.5 active:translate-y-px" onClick={() => setStep("shipping")}>Back</button>
              <button type="button" className="btn btn-primary transition-transform hover:-translate-y-0.5 active:translate-y-px" onClick={goToReview}>Review Order</button>
            </div>
          </section>
        )}

        {/* Review step */}
        {step === "review" && (
          <section className="space-y-4 rounded border p-4">
            <h2 className="text-lg font-semibold tracking-widest">Review & Confirm</h2>
            <p className="text-sm text-neutral-700">Double‑check your details and place the order.</p>
            <div className="flex gap-3">
              <button type="button" className="btn transition-transform hover:-translate-y-0.5 active:translate-y-px" onClick={() => setStep("payment")}>Back</button>
              <button disabled={isSubmitting || items.length === 0} className="btn btn-primary transition-transform hover:-translate-y-0.5 active:translate-y-px">
                {isSubmitting ? "Processing…" : "Place Order"}
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Sidebar: Order summary + promo */}
      <aside className="space-y-4 md:sticky md:top-8 h-fit">
        <h2 className="text-lg font-semibold tracking-widest">Order Summary</h2>
        <div className="rounded border p-4 space-y-3">
          {items.length === 0 && <p>Your cart is empty.</p>}
          {items.map((i) => (
            <div key={i.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{i.name}</p>
                <p className="text-neutral-600">x{i.quantity}</p>
              </div>
              <p>${i.price * i.quantity}</p>
            </div>
          ))}
          <hr />
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>${totals.subtotal}</span></div>
          <div className="flex justify-between text-sm"><span>Shipping</span><span>${totals.shipping}</span></div>
          <div className="flex justify-between text-sm"><span>Tax</span><span>${totals.tax}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-700"><span>Discount</span><span>- ${discount}</span></div>
          )}
          <div className="flex justify-between font-semibold"><span>Grand Total</span><span>${appliedTotals.grandTotal}</span></div>
        </div>

        <div className="rounded border p-4 space-y-3">
          <label className="block text-sm">Promo code
            <div className="mt-1 flex gap-2">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="SAVE10 or FREESHIP"
                className="flex-1 border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              />
              <button type="button" className="btn transition-transform hover:-translate-y-0.5 active:translate-y-px" onClick={applyPromo}>Apply</button>
            </div>
            {promoError && <p className="text-red-600 text-xs mt-1" aria-live="polite">{promoError}</p>}
          </label>
        </div>
      </aside>
    </form>
  );
}