import type { CheckoutSummary } from "../../types/order.types";
import { useCheckoutStore } from "../../store/checkoutStore";

const COD_FEE = 200;

type OrderSummaryProps = {
  summary: CheckoutSummary;
};

export default function OrderSummary({ summary }: OrderSummaryProps) {
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);
  const redeemLoyaltyPoints = useCheckoutStore((state) => state.redeemLoyaltyPoints);

  const codFee = paymentMethod === "COD" ? summary.codFee ?? COD_FEE : 0;
  const loyaltyDiscount = redeemLoyaltyPoints ? summary.loyaltyDiscount ?? 0 : 0;
  const displayTotal = Math.max(0, summary.total + codFee - loyaltyDiscount);

  return (
    <aside className="h-fit rounded-lg border border-border bg-bg-secondary p-4 lg:sticky lg:top-24">
      <h2 className="font-heading text-lg text-text-primary">Order summary</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-text-secondary">Subtotal</dt>
          <dd>Rs. {summary.subtotal.toLocaleString()}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-secondary">Shipping</dt>
          <dd>{summary.shipping === 0 ? "Free" : `Rs. ${summary.shipping.toLocaleString()}`}</dd>
        </div>
        {summary.discount > 0 ? (
          <div className="flex justify-between text-green-600">
            <dt>Discount</dt>
            <dd>- Rs. {summary.discount.toLocaleString()}</dd>
          </div>
        ) : null}
        {loyaltyDiscount > 0 ? (
          <div className="flex justify-between text-green-600">
            <dt>Loyalty points</dt>
            <dd>- Rs. {loyaltyDiscount.toLocaleString()}</dd>
          </div>
        ) : null}
        {codFee > 0 ? (
          <div className="flex justify-between">
            <dt className="text-text-secondary">COD fee</dt>
            <dd>Rs. {codFee.toLocaleString()}</dd>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-accent-gold">
          <dt>Total</dt>
          <dd>Rs. {displayTotal.toLocaleString()}</dd>
        </div>
      </dl>
    </aside>
  );
}
