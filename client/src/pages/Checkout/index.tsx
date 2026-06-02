import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCheckoutSummary, placeOrder } from "../../services/orderService";
import { useCartStore } from "../../store/cartStore";
import type { CreateOrderInput } from "../../types/order.types";

const emptyAddress: CreateOrderInput["address"] = {
  label: "Home",
  street: "",
  area: "",
  city: "",
  province: "",
  postalCode: ""
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const fetchCart = useCartStore((state) => state.fetchCart);
  const [address, setAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "STRIPE">("COD");
  const [saveAddress, setSaveAddress] = useState(true);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: summary, isLoading, isError } = useQuery({
    queryKey: ["checkout-summary"],
    queryFn: fetchCheckoutSummary
  });

  useEffect(() => {
    if (isError) {
      navigate("/cart", { replace: true });
    }
  }, [isError, navigate]);

  const updateAddress = (field: keyof typeof emptyAddress, value: string) => {
    setAddress((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await placeOrder({
        paymentMethod,
        address,
        saveAddress,
        notes: notes.trim() || undefined
      });

      await fetchCart();

      if (paymentMethod === "STRIPE" && result.clientSecret) {
        setError("Stripe checkout requires additional setup. Your order was created as pending.");
        navigate(`/orders/${result.order.id}`);
        return;
      }

      navigate(`/orders/${result.order.id}`);
    } catch (submitError) {
      const message =
        (submitError as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Could not place order";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !summary) {
    return <p className="text-text-secondary">Preparing checkout…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-accent-gold">Checkout</h1>
        <p className="mt-1 text-sm text-text-secondary">{summary.itemCount} items in your order</p>
      </div>

      <fieldset className="space-y-4">
        <legend className="font-heading text-xl text-text-primary">Shipping address</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-text-secondary">Label</span>
            <input
              required
              value={address.label}
              onChange={(event) => updateAddress("label", event.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="text-text-secondary">Postal code</span>
            <input
              required
              value={address.postalCode}
              onChange={(event) => updateAddress("postalCode", event.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-text-secondary">Street</span>
            <input
              required
              value={address.street}
              onChange={(event) => updateAddress("street", event.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="text-text-secondary">Area</span>
            <input
              required
              value={address.area}
              onChange={(event) => updateAddress("area", event.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="text-text-secondary">City</span>
            <input
              required
              value={address.city}
              onChange={(event) => updateAddress("city", event.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-text-secondary">Province</span>
            <input
              required
              value={address.province}
              onChange={(event) => updateAddress("province", event.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
            />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={saveAddress}
            onChange={(event) => setSaveAddress(event.target.checked)}
          />
          Save this address to my account
        </label>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-heading text-xl text-text-primary">Payment</legend>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          <span>Cash on delivery</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 opacity-80">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "STRIPE"}
            onChange={() => setPaymentMethod("STRIPE")}
          />
          <span>Card (Stripe) — may require live keys</span>
        </label>
      </fieldset>

      <label className="block text-sm">
        <span className="text-text-secondary">Order notes (optional)</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
        />
      </label>

      <aside className="rounded-lg border border-border bg-bg-secondary p-4">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-secondary">Subtotal</dt>
            <dd>Rs. {summary.subtotal.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-secondary">Shipping</dt>
            <dd>Rs. {summary.shipping.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold text-accent-gold">
            <dt>Total</dt>
            <dd>Rs. {summary.total.toLocaleString()}</dd>
          </div>
        </dl>
      </aside>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-accent-gold px-6 py-3 font-medium text-bg-primary disabled:opacity-50"
      >
        {isSubmitting ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
