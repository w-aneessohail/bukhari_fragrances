import HeroSection from "../../components/home/HeroSection";
import CategoryStrip from "../../components/home/CategoryStrip";
import ProductSection from "../../components/home/ProductSection";
import BrandStory from "../../components/home/BrandStory";
import ScentFinderSection from "../../components/home/ScentFinderSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import {
  fetchBestsellerProducts,
  fetchFeaturedProducts,
  fetchNewArrivals
} from "../../services/productService";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryStrip />
      <ProductSection
        title="Featured fragrances"
        subtitle="Hand-picked selections from our master perfumers"
        queryKey="featured-products"
        fetcher={fetchFeaturedProducts}
        shopLink="/shop?isFeatured=true"
      />
      <ProductSection
        title="Bestsellers"
        subtitle="Loved by our customers across Pakistan"
        queryKey="bestseller-products"
        fetcher={fetchBestsellerProducts}
        shopLink="/shop?sort=bestseller"
      />
      <ProductSection
        title="New arrivals"
        subtitle="The latest additions to the Bukhari collection"
        queryKey="new-arrivals"
        fetcher={fetchNewArrivals}
        shopLink="/shop?sort=newest"
      />
      <ScentFinderSection />
      <TestimonialsSection />
      <BrandStory />
    </>
  );
}
