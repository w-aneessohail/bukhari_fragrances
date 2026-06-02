import type { ProductSize } from "../../types/product.types";

type SizeSelectorProps = {
  sizes: ProductSize[];
  selectedId: string | null;
  onSelect: (size: ProductSize) => void;
};

export default function SizeSelector({ sizes, selectedId, onSelect }: SizeSelectorProps) {
  if (sizes.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-text-primary">Size</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = size.id === selectedId;
          const outOfStock = size.stock <= 0;

          return (
            <button
              key={size.id}
              type="button"
              disabled={outOfStock}
              onClick={() => onSelect(size)}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                outOfStock
                  ? "cursor-not-allowed border-border text-text-secondary opacity-50"
                  : isSelected
                    ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                    : "border-border hover:border-accent-gold"
              }`}
            >
              <span className="font-medium">{size.sizeMl} ml</span>
              <span className="mt-0.5 block text-xs text-text-secondary">
                Rs. {size.price.toLocaleString()}
                {outOfStock ? " · Out of stock" : ` · ${size.stock} left`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
