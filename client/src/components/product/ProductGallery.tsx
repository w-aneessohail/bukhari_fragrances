import { useState } from "react";
import type { ProductImage } from "../../types/product.types";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
  fallbackImage?: string | null;
};

export default function ProductGallery({ images, productName, fallbackImage }: ProductGalleryProps) {
  const galleryImages =
    images.length > 0
      ? images
      : fallbackImage
        ? [{ id: "main", url: fallbackImage, altText: productName, isMain: true, sortOrder: 0 }]
        : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const active = galleryImages[activeIndex];

  if (galleryImages.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-xl border border-border bg-bg-secondary text-text-secondary">
        No image available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-bg-secondary">
        <img
          src={active.url}
          alt={active.altText ?? productName}
          className="aspect-[3/4] w-full object-cover"
        />
      </div>

      {galleryImages.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-20 w-16 shrink-0 overflow-hidden rounded-md border-2 transition ${
                index === activeIndex ? "border-accent-gold" : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              <img src={image.url} alt={image.altText ?? productName} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
