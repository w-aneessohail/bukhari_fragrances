import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import OrderSummary from "../../components/checkout/OrderSummary";
import PageLoadingScreen from "../../components/ui/PageLoadingScreen";
import { fetchCheckoutSummary, placeOrder } from "../../services/orderService";
import { fetchAddresses, type Address } from "../../services/userService";
import { useCartStore } from "../../store/cartStore";
import { useCheckoutStore } from "../../store/checkoutStore";
import { readGiftNotes } from "../GiftBuilder";

const cities = ["Lahore", "Karachi", "Islamabad"];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const fetchCart = useCartStore((state) => state.fetchCart);
  const {
    step,
    address,
    paymentMethod,
    saveAddress,
    notes,
    redeemLoyaltyPoints,
    jazzCashMobile,
    placedOrder,
    clientSecret,
    setAddress,
    setPaymentMethod,
    setSaveAddress,
    setNotes,
    setRedeemLoyaltyPoints,
    setJazzCashMobile,
    setPlacedOrder,
    nextStep,
    prevStep
  } = useCheckoutStore();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: summary, isLoading, isError } = useQuery({
    queryKey: ["checkout-summary"],
    queryFn: fetchCheckoutSummary
  });

  const { data: savedAddresses = [] } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses
  });

  useEffect(() => {
    if (isError) {
      navigate("/cart", { replace: true });
    }
  }, [isError, navigate]);

  useEffect(() => {
    const giftNotes = readGiftNotes();
    if (giftNotes && !notes) {
      setNotes(giftNotes);
    }
  }, [notes, setNotes]);

  const applySavedAddress = (saved: Address) => {
    setAddress({
      label: saved.label,
      street: saved.street,
      area: saved.area,
      city: saved.city,
      province: saved.province,
      postalCode: saved.postalCode,
      phone: address.phone
    });
  };

  const updateAddress = (field: keyof typeof address, value: string) => {
    setAddress({ ...address, [field]: value });
  };

  const validateAddress = () => {
    if (!address.street.trim() || !address.area.trim() || !address.postalCode.trim()) {
      setError("Please complete all required address fields.");
      return false;
    }
    setError(null);
    return true;
  };

  const handlePlaceOrder = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await placeOrder({
        paymentMethod,
        address,
        saveAddress,
        notes: notes.trim() || undefined,
        redeemLoyaltyPoints,
        jazzCashMobile: paymentMethod === "JAZZCASH" ? jazzCashMobile : undefined
      });

      await fetchCart();
      setPlacedOrder(result.order, result.clientSecret);

      if (result.jazzCashRedirect) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = result.jazzCashRedirect.redirectUrl;
        Object.entries(result.jazzCashRedirect.formFields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        return;
      }

      nextStep();
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
    return <PageLoadingScreen label="Preparing checkout" />;
  }

  if (step === 4 && placedOrder) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
        <div className="text-5xl">✓</div>
        <h1 className="font-heading text-3xl text-accent-gold">Order confirmed</h1>
        <p className="text-text-secondary">
          Thank you. Your order <strong className="text-text-primary">{placedOrder.orderNumber}</strong> has been placed.
        </p>
        <p className="text-sm text-text-secondary">
          Expected delivery by {deliveryDate.toLocaleDateString()}
        </p>
        {clientSecret ? (
          <p className="text-sm text-text-secondary">
            Card payment requires Stripe Elements setup. Your order is pending until payment completes.
          </p>
        ) : null}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Link
            to={`/orders/${placedOrder.id}`}
            className="rounded-lg bg-accent-gold px-6 py-3 text-sm font-medium text-bg-primary"
          >
            Track order
          </Link>
          <Link to="/shop" className="rounded-lg border border-border px-6 py-3 text-sm hover:border-accent-gold hover:text-accent-gold">
            Continue shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl text-accent-gold">Checkout</h1>
          <p className="mt-1 text-sm text-text-secondary">{summary.itemCount} items in your order</p>
        </div>

        {step === 1 ? (
          <fieldset className="space-y-4">
            <legend className="font-heading text-xl text-text-primary">Shipping address</legend>

            {savedAddresses.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-text-secondary">Use a saved address</p>
                <div className="flex flex-wrap gap-2">
                  {savedAddresses.map((saved) => (
                    <button
                      key={saved.id}
                      type="button"
                      onClick={() => applySavedAddress(saved)}
                      className="rounded-lg border border-border px-3 py-2 text-sm hover:border-accent-gold"
                    >
                      {saved.label}
                      {saved.isDefault ? " (default)" : ""}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="text-text-secondary">Label</span>
                <select
                  value={address.label}
                  onChange={(event) => updateAddress("label", event.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
                >
                  <option>Home</option>
                  <option>Office</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-text-secondary">Phone</span>
                <input
                  value={address.phone ?? ""}
                  onChange={(event) => updateAddress("phone", event.target.value)}
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
                <select
                  value={address.city}
                  onChange={(event) => updateAddress("city", event.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
                >
                  {cities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-text-secondary">Province</span>
                <input
                  required
                  value={address.province}
                  onChange={(event) => updateAddress("province", event.target.value)}
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
        ) : null}

        {step === 2 ? (
          <fieldset className="space-y-4">
            <legend className="font-heading text-xl text-text-primary">Payment method</legend>
            {[
              { id: "COD" as const, label: "Cash on delivery", detail: `Rs. ${summary.codFee ?? 200} COD fee applies` },
              { id: "STRIPE" as const, label: "Credit / debit card (Stripe)", detail: "Secure card payment" },
              { id: "JAZZCASH" as const, label: "JazzCash mobile wallet", detail: "Redirect to JazzCash to pay" }
            ].map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-4 ${
                  paymentMethod === option.id ? "border-accent-gold" : "border-border"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                  />
                  <span>{option.label}</span>
                </span>
                <span className="pl-7 text-xs text-text-secondary">{option.detail}</span>
              </label>
            ))}

            {paymentMethod === "JAZZCASH" ? (
              <label className="block text-sm">
                <span className="text-text-secondary">JazzCash mobile number</span>
                <input
                  required
                  value={jazzCashMobile}
                  onChange={(event) => setJazzCashMobile(event.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
                />
              </label>
            ) : null}

            {(summary.loyaltyDiscount ?? 0) > 0 ? (
              <label className="flex items-center gap-2 rounded-lg border border-border p-4 text-sm">
                <input
                  type="checkbox"
                  checked={redeemLoyaltyPoints}
                  onChange={(event) => setRedeemLoyaltyPoints(event.target.checked)}
                />
                <span>
                  Use loyalty points ({summary.loyaltyBalance?.toLocaleString()} available) for Rs.{" "}
                  {summary.loyaltyDiscount?.toLocaleString()} off
                </span>
              </label>
            ) : null}

            <label className="block text-sm">
              <span className="text-text-secondary">Order notes (optional)</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
              />
            </label>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl text-text-primary">Delivery address</h2>
                <button type="button" onClick={() => useCheckoutStore.getState().setStep(1)} className="text-sm underline">
                  Edit
                </button>
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                {address.label}: {address.street}, {address.area}, {address.city}, {address.province}{" "}
                {address.postalCode}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl text-text-primary">Payment</h2>
                <button type="button" onClick={() => useCheckoutStore.getState().setStep(2)} className="text-sm underline">
                  Edit
                </button>
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                {paymentMethod === "COD"
                  ? "Cash on delivery"
                  : paymentMethod === "STRIPE"
                    ? "Card (Stripe)"
                    : `JazzCash (${jazzCashMobile})`}
              </p>
            </div>
          </div>
        ) : null}

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={prevStep}
              className="rounded-lg border border-border px-6 py-3 text-sm hover:border-accent-gold hover:text-accent-gold"
            >
              Back
            </button>
          ) : null}

          {step === 1 ? (
            <button
              type="button"
              onClick={() => {
                if (validateAddress()) nextStep();
              }}
              className="rounded-lg bg-accent-gold px-6 py-3 text-sm font-medium text-bg-primary"
            >
              Continue to payment
            </button>
          ) : null}

          {step === 2 ? (
            <button
              type="button"
              onClick={() => {
                if (paymentMethod === "JAZZCASH" && !jazzCashMobile.trim()) {
                  setError("Enter your JazzCash mobile number.");
                  return;
                }
                setError(null);
                nextStep();
              }}
              className="rounded-lg bg-accent-gold px-6 py-3 text-sm font-medium text-bg-primary"
            >
              Review order
            </button>
          ) : null}

          {step === 3 ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handlePlaceOrder}
              className="rounded-lg bg-accent-gold px-6 py-3 text-sm font-medium text-bg-primary disabled:opacity-50"
            >
              {isSubmitting ? "Placing order…" : "Place order"}
            </button>
          ) : null}
        </div>
      </div>

      <OrderSummary summary={summary} />
    </div>
  );
}
