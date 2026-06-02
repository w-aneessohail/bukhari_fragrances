import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useWishlistStore } from "../../store/wishlistStore";

type WishlistButtonProps = {
  productId: string;
  className?: string;
};

export default function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const inWishlist = useWishlistStore((state) => state.isInWishlist(productId));
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const [isBusy, setIsBusy] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    setIsBusy(true);
    try {
      await toggleItem(productId);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isBusy}
      onClick={handleClick}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={`rounded-lg border border-border px-4 py-3 text-sm transition hover:border-accent-gold disabled:opacity-50 ${className}`}
    >
      {inWishlist ? "♥ Saved" : "♡ Save"}
    </button>
  );
}
