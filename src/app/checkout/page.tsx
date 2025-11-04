import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-static";

export default function CheckoutPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl md:text-4xl font-semibold uppercase tracking-[0.25em]">Checkout</h1>
      <p className="mt-3 text-neutral-700 max-w-xl">Complete your details to place the order.</p>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </div>
  );
}