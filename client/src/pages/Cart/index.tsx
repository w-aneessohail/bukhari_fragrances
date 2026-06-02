import { useState } from "react";
import { Link } from "react-router-dom";
import CartLineItem from "../../components/cart/CartLineItem";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export default function CartPage() {
  const { cart, isLoading, error, updateItem, removeItem, clear } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    setUpdatingId(itemId);
    try {
      await updateItem(itemId, quantity);
    } finally {
      setUpdatingId(null);
    }
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
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-secondary">Subtotal</dt>
                <dd className="font-medium">Rs. {cart.subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">Shipping</dt>
                <dd className="text-text-secondary">Calculated at checkout</dd>
              </div>
            </dl>
            <p className="mt-6 text-2xl font-semibold text-accent-gold">Rs. {cart.subtotal.toLocaleString()}</p>
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
