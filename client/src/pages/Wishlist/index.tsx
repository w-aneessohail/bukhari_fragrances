import { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import PageLoadingScreen from "../../components/ui/PageLoadingScreen";
import { useWishlistStore } from "../../store/wishlistStore";

export default function WishlistPage() {
  const { items, isLoading, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (isLoading) {
    return <PageLoadingScreen label="Loading wishlist" />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-heading text-4xl text-accent-gold">Wishlist</h1>
      <p className="mt-2 text-text-secondary">Fragrances you have saved for later.</p>

      {items.length === 0 ? (
        <div className="site-panel mt-10 rounded-xl p-10 text-center">
          <p className="text-text-secondary">Your wishlist is empty.</p>
          <Link to="/shop" className="mt-6 inline-block text-accent-gold underline">
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((entry) => (
            <ProductCard key={entry.wishlistId} product={entry.product} />
          ))}
        </div>
      )}
    </section>
  );
}
