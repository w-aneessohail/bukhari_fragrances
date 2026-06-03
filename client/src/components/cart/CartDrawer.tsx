import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartDrawerStore } from "../../store/cartDrawerStore";
import { useCartStore } from "../../store/cartStore";
import CartLineItem from "./CartLineItem";

export default function CartDrawer() {
  const isOpen = useCartDrawerStore((state) => state.isOpen);
  const close = useCartDrawerStore((state) => state.close);
  const { cart, isLoading, error, updateItem, removeItem, applyDiscount, removeDiscount } =
    useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

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
    if (!discountCode.trim()) return;

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

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-bg-primary shadow-luxury"
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-heading text-xl text-accent-gold">Your cart</h2>
                <p className="text-xs text-text-secondary">
                  {cart.itemCount === 0
                    ? "Empty"
                    : `${cart.itemCount} item${cart.itemCount === 1 ? "" : "s"}`}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded border border-border px-3 py-1 text-sm text-text-secondary hover:text-accent-gold"
              >
                Close
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="h-28 animate-pulse rounded-xl bg-bg-secondary" />
                  ))}
                </div>
              ) : cart.items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    className="text-5xl"
                  >
                    🛍️
                  </motion.div>
                  <p className="mt-4 text-text-secondary">Your cart is empty.</p>
                  <Link
                    to="/shop"
                    onClick={close}
                    className="mt-6 rounded-lg bg-accent-gold px-6 py-3 text-sm font-medium text-bg-primary"
                  >
                    Continue shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {error ? <p className="text-sm text-red-500">{error}</p> : null}
                  {cart.items.map((item) => (
                    <CartLineItem
                      key={item.id}
                      item={item}
                      compact
                      isUpdating={updatingId === item.id}
                      onUpdateQuantity={(quantity) => handleUpdateQuantity(item.id, quantity)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {cart.items.length > 0 ? (
              <footer className="border-t border-border px-5 py-4">
                <form onSubmit={handleApplyDiscount} className="mb-4 space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={discountCode}
                      onChange={(event) => setDiscountCode(event.target.value.toUpperCase())}
                      placeholder="Discount code"
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
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-accent-gold">{cart.discountCode} applied</span>
                      <button
                        type="button"
                        onClick={() => removeDiscount()}
                        className="text-text-secondary underline hover:text-accent-gold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}
                </form>

                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-text-secondary">Subtotal</dt>
                    <dd>Rs. {cart.subtotal.toLocaleString()}</dd>
                  </div>
                  {cart.discount > 0 ? (
                    <div className="flex justify-between text-green-600">
                      <dt>Discount</dt>
                      <dd>- Rs. {cart.discount.toLocaleString()}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between">
                    <dt className="text-text-secondary">Shipping</dt>
                    <dd>{cart.shipping === 0 ? "Free" : `Rs. ${cart.shipping.toLocaleString()}`}</dd>
                  </div>
                  <div className="flex justify-between pt-2 text-lg font-semibold text-accent-gold">
                    <dt>Total</dt>
                    <dd>Rs. {cart.total.toLocaleString()}</dd>
                  </div>
                </dl>

                <div className="mt-4 grid gap-2">
                  <Link
                    to="/cart"
                    onClick={close}
                    className="block rounded-lg border border-border px-4 py-3 text-center text-sm hover:border-accent-gold hover:text-accent-gold"
                  >
                    View full cart
                  </Link>
                  <Link
                    to={isAuthenticated ? "/checkout" : "/login"}
                    onClick={close}
                    className="block rounded-lg bg-accent-gold px-4 py-3 text-center text-sm font-medium text-bg-primary"
                  >
                    {isAuthenticated ? "Proceed to checkout" : "Sign in to checkout"}
                  </Link>
                </div>
              </footer>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
