import { Link } from "react-router-dom";
import type { CartItem } from "../../types/cart.types";

type CartLineItemProps = {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  isUpdating?: boolean;
};

export default function CartLineItem({ item, onUpdateQuantity, onRemove, isUpdating }: CartLineItemProps) {
  const maxStock = item.size?.stock ?? item.product.stock;

  return (
    <article className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <Link
        to={`/product/${item.product.slug}`}
        className="h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-bg-secondary"
      >
        {item.product.mainImage ? (
          <img src={item.product.mainImage} alt={item.product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-text-secondary">No image</div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link to={`/product/${item.product.slug}`} className="font-heading text-lg text-text-primary hover:text-accent-gold">
            {item.product.name}
          </Link>
          {item.size ? (
            <p className="mt-1 text-sm text-text-secondary">{item.size.sizeMl} ml</p>
          ) : null}
          <p className="mt-1 text-sm text-accent-gold">Rs. {item.price.toLocaleString()} each</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUpdating || item.quantity <= 1}
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="h-8 w-8 rounded border border-border disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[2rem] text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              disabled={isUpdating || item.quantity >= maxStock}
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="h-8 w-8 rounded border border-border disabled:opacity-50"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold text-text-primary">Rs. {item.lineTotal.toLocaleString()}</span>
            <button
              type="button"
              disabled={isUpdating}
              onClick={onRemove}
              className="text-sm text-text-secondary underline hover:text-accent-gold"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
