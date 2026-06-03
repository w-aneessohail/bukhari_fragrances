export function buildOrganizationJsonLd() {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://bukhariperfumes.com";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bukhari Perfumes",
    url: origin,
    description: "Luxury fragrances crafted in Lahore, Pakistan.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressCountry: "PK"
    }
  };
}

export function buildProductJsonLd(product: {
  name: string;
  description: string;
  slug: string;
  price: number;
  salePrice: number | null;
  stock: number;
  mainImage: string | null;
  avgRating: number;
  reviewCount: number;
}) {
  const price = product.salePrice ?? product.price;
  const origin = typeof window !== "undefined" ? window.location.origin : "https://bukhariperfumes.com";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.mainImage ?? undefined,
    url: `${origin}/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: String(price),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(product.avgRating),
            reviewCount: String(product.reviewCount)
          }
        }
      : {})
  };
}
