import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import PageLoadingScreen from "../../components/ui/PageLoadingScreen";
import { fetchProductBySlug, fetchProducts } from "../../services/productService";

const GIFT_NOTES_KEY = "bukhari_gift_notes";

export function readGiftNotes() {
  return sessionStorage.getItem(GIFT_NOTES_KEY) ?? "";
}

export function saveGiftNotes(message: string) {
  if (message.trim()) {
    sessionStorage.setItem(GIFT_NOTES_KEY, message.trim());
  } else {
    sessionStorage.removeItem(GIFT_NOTES_KEY);
  }
}

export default function GiftBuilderPage() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [giftMessage, setGiftMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["gift-builder-products"],
    queryFn: () => fetchProducts({ limit: 50, inStock: true })
  });

  const products = productsResponse?.data ?? [];

  const toggleProduct = (productId: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleAddToCart = async () => {
    if (selected.size === 0) {
      setStatus("Select at least one fragrance.");
      return;
    }

    setIsAdding(true);
    setStatus(null);

    try {
      for (const productId of selected) {
        const summary = products.find((product) => product.id === productId);
        if (!summary) continue;

        const detail = await fetchProductBySlug(summary.slug);
        const size =
          detail.sizes.length > 0
            ? detail.sizes.find((entry) => entry.stock > 0) ?? detail.sizes[0]
            : null;

        await addItem({
          productId,
          sizeId: size?.id ?? null,
          quantity: 1
        });
      }

      saveGiftNotes(giftMessage);
      navigate("/cart");
    } catch {
      setStatus("Could not add items to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return <PageLoadingScreen label="Loading fragrances" />;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <h1 className="font-heading text-4xl text-accent-gold">Gift builder</h1>
      <p className="mt-2 text-text-secondary">
        Curate a Bukhari Perfumes gift set and add your message at checkout.
      </p>

      <label className="mt-8 block text-sm">
        <span className="text-text-secondary">Gift message (optional)</span>
        <textarea
          rows={3}
          value={giftMessage}
          onChange={(event) => setGiftMessage(event.target.value)}
          placeholder="For someone special…"
          className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
        />
      </label>

      <ul className="mt-8 space-y-3">
          {products.map((product) => (
            <li key={product.id}>
              <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card p-4">
                <input
                  type="checkbox"
                  checked={selected.has(product.id)}
                  onChange={() => toggleProduct(product.id)}
                />
                {product.mainImage ? (
                  <img src={product.mainImage} alt={product.name} className="h-16 w-12 rounded object-cover" />
                ) : null}
                <span className="flex-1">
                  <span className="font-medium text-text-primary">{product.name}</span>
                  <span className="mt-0.5 block text-sm text-accent-gold">
                    Rs. {(product.salePrice ?? product.price).toLocaleString()}
                  </span>
                </span>
                <Link to={`/product/${product.slug}`} className="text-xs text-text-secondary underline">
                  View
                </Link>
              </label>
            </li>
          ))}
        </ul>

      {status ? <p className="mt-4 text-sm text-red-500">{status}</p> : null}

      <button
        type="button"
        disabled={isAdding || selected.size === 0}
        onClick={handleAddToCart}
        className="mt-8 rounded-lg bg-accent-gold px-8 py-3 font-medium text-bg-primary disabled:opacity-50"
      >
        {isAdding ? "Adding…" : `Add ${selected.size} to cart`}
      </button>
    </section>
  );
}
