import { useState } from "react";
import { Link } from "react-router-dom";
import CartLineItem from "../../components/cart/CartLineItem";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export default function CartPage() {
  const { cart, isLoading, error, updateItem, removeItem, clear, applyDiscount, removeDiscount } =
    useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    setUpdatingId(itemId);
    try {
      await updateItem(itemId, quantity);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApplyDiscount = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!discountCode.trim()) {
      return;
    }

    setDiscountError(null);
    setIsApplyingDiscount(true);
    try {
      await applyDiscount(discountCode.trim());
      setDiscountCode("");
    } catch (err) {
      setDiscountError(err instanceof Error ? err.message : "Could not apply discount");
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = async () => {
    setDiscountError(null);
    await removeDiscount();
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <div className="h-10 w-48 animate-pulse rounded bg-bg-secondary" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-xl bg-bg-secondary" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl text-accent-gold">Your cart</h1>
          <p className="mt-2 text-text-secondary">
            {cart.itemCount === 0
              ? "Your cart is empty."
              : `${cart.itemCount} item${cart.itemCount === 1 ? "" : "s"} in your bag`}
          </p>
        </div>
        {cart.items.length > 0 ? (
          <button
            type="button"
            onClick={() => clear()}
            className="text-sm text-text-secondary underline hover:text-accent-gold"
          >
            Clear cart
          </button>
        ) : null}
      </div>

      {error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}

      {cart.items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-text-secondary">Discover fragrances crafted for every occasion.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-lg bg-accent-gold px-6 py-3 font-medium text-bg-primary"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                isUpdating={updatingId === item.id}
                onUpdateQuantity={(quantity) => handleUpdateQuantity(item.id, quantity)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>

          <aside className="h-fit rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-xl text-text-primary">Order summary</h2>

            <form onSubmit={handleApplyDiscount} className="mt-4 space-y-2">
              <label className="block text-sm text-text-secondary" htmlFor="discount-code">
                Discount code
              </label>
              <div className="flex gap-2">
                <input
                  id="discount-code"
                  value={discountCode}
                  onChange={(event) => setDiscountCode(event.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME10"
                  className="min-w-0 flex-1 rounded-md border border-border bg-input px-3 py-2 text-sm uppercase"
                />
                <button
                  type="submit"
                  disabled={isApplyingDiscount || !discountCode.trim()}
                  className="rounded-md border border-border px-3 py-2 text-sm hover:border-accent-gold hover:text-accent-gold disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              {discountError ? <p className="text-xs text-red-500">{discountError}</p> : null}
              {cart.discountCode ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-accent-gold">{cart.discountCode} applied</span>
                  <button
                    type="button"
                    onClick={handleRemoveDiscount}
                    className="text-text-secondary underline hover:text-accent-gold"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </form>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-secondary">Subtotal</dt>
                <dd className="font-medium">Rs. {cart.subtotal.toLocaleString()}</dd>
              </div>
              {cart.discount > 0 ? (
                <div className="flex justify-between text-green-600">
                  <dt>Discount</dt>
                  <dd>- Rs. {cart.discount.toLocaleString()}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-text-secondary">Shipping</dt>
                <dd className="font-medium">
                  {cart.shipping === 0 ? "Free" : `Rs. ${cart.shipping.toLocaleString()}`}
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-2xl font-semibold text-accent-gold">
              Rs. {cart.total.toLocaleString()}
            </p>
            <Link
              to={isAuthenticated ? "/checkout" : "/login"}
              className="mt-6 block w-full rounded-lg bg-accent-gold px-6 py-3 text-center font-medium text-bg-primary"
            >
              {isAuthenticated ? "Proceed to checkout" : "Sign in to checkout"}
            </Link>
            <Link to="/shop" className="mt-3 block text-center text-sm text-text-secondary underline">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
