import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import ProductGallery from "../../components/product/ProductGallery";
import ScentNoteWheel from "../../components/product/ScentNoteWheel";
import SizeSelector from "../../components/product/SizeSelector";
import { fetchProductBySlug } from "../../services/productService";
import type { ProductSize } from "../../types/product.types";

function formatLabel(value: string) {
  return value.replace(/_/g, " ");
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: Boolean(slug)
  });

  useEffect(() => {
    if (!product?.sizes.length) {
      setSelectedSize(null);
      return;
    }

    const inStock = product.sizes.find((size) => size.stock > 0) ?? product.sizes[0];
    setSelectedSize(inStock);
  }, [product?.id, product?.sizes]);

  const displayPrice = useMemo(() => {
    if (!product) return null;
    if (selectedSize) return selectedSize.price;
    const hasSale = product.salePrice !== null && product.salePrice < product.price;
    return hasSale ? product.salePrice : product.price;
  }, [product, selectedSize]);

  const compareAtPrice = useMemo(() => {
    if (!product || selectedSize) return null;
    const hasSale = product.salePrice !== null && product.salePrice < product.price;
    return hasSale ? product.price : null;
  }, [product, selectedSize]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-[3/4] animate-pulse rounded-xl bg-bg-secondary" />
          <div className="space-y-4">
            <div className="h-10 w-2/3 animate-pulse rounded bg-bg-secondary" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-bg-secondary" />
            <div className="h-24 animate-pulse rounded bg-bg-secondary" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center md:px-6">
        <h1 className="font-heading text-3xl text-text-primary">Product not found</h1>
        <p className="mt-2 text-text-secondary">This fragrance may no longer be available.</p>
        <Link to="/shop" className="mt-6 inline-block text-accent-gold underline">
          Back to shop
        </Link>
      </section>
    );
  }

  const canAddToCart =
    (selectedSize ? selectedSize.stock > 0 : product.stock > 0) && product.isActive;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <nav className="mb-6 text-sm text-text-secondary">
        <Link to="/shop" className="hover:text-accent-gold">
          Shop
        </Link>
        {product.category ? (
          <>
            <span className="mx-2">/</span>
            <Link to={`/shop?category=${product.category.slug}`} className="hover:text-accent-gold">
              {product.category.name}
            </Link>
          </>
        ) : null}
        <span className="mx-2">/</span>
        <span className="text-text-primary">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} fallbackImage={product.mainImage} />

        <div>
          <p className="text-xs uppercase tracking-wide text-text-secondary">{formatLabel(product.scentFamily)}</p>
          <h1 className="mt-1 font-heading text-4xl text-text-primary">{product.name}</h1>
          <p className="mt-2 text-sm text-text-secondary">
            {product.avgRating.toFixed(1)} ★ · {product.reviewCount} reviews · SKU {product.sku}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-border px-3 py-1">{formatLabel(product.gender)}</span>
            <span className="rounded-full border border-border px-3 py-1">{formatLabel(product.concentration)}</span>
            {product.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full border border-border px-3 py-1">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            {displayPrice !== null ? (
              <span className="text-3xl font-semibold text-accent-gold">Rs. {displayPrice.toLocaleString()}</span>
            ) : null}
            {compareAtPrice !== null ? (
              <span className="text-lg text-text-secondary line-through">Rs. {compareAtPrice.toLocaleString()}</span>
            ) : null}
          </div>

          <div className="mt-6 space-y-6">
            <SizeSelector
              sizes={product.sizes}
              selectedId={selectedSize?.id ?? null}
              onSelect={setSelectedSize}
            />

            <button
              type="button"
              disabled={!canAddToCart}
              className="w-full rounded-lg bg-accent-gold px-6 py-3 font-medium text-bg-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {canAddToCart ? "Add to cart" : "Out of stock"}
            </button>

            <p className="text-sm leading-relaxed text-text-secondary">{product.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-heading text-2xl text-accent-gold">Scent profile</h2>
          <p className="mt-1 text-sm text-text-secondary">How this fragrance unfolds on skin.</p>
          <div className="mt-6">
            <ScentNoteWheel notes={product.scentNotes} />
          </div>
        </div>

        <div>
          <h2 className="font-heading text-2xl text-accent-gold">Reviews</h2>
          {product.reviews.length === 0 ? (
            <p className="mt-4 text-sm text-text-secondary">No reviews yet. Be the first to share your experience.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {product.reviews.map((review) => (
                <li key={review.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-text-primary">{review.user.name}</span>
                    <span className="text-sm text-accent-gold">{review.rating} ★</span>
                  </div>
                  {review.comment ? (
                    <p className="mt-2 text-sm text-text-secondary">{review.comment}</p>
                  ) : null}
                  {review.isVerified ? (
                    <p className="mt-2 text-xs text-text-secondary">Verified purchase</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {product.relatedProducts.length > 0 ? (
        <div className="mt-16">
          <h2 className="font-heading text-2xl text-accent-gold">You may also like</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {product.relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
