export type ProductSummary = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  sku: string;
  gender: string;
  concentration: string;
  scentFamily: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  mainImage: string | null;
  category: { id: string; name: string; slug: string } | null;
  avgRating: number;
  reviewCount: number;
  orderCount: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type ProductListResponse = {
  success: boolean;
  message: string;
  data: ProductSummary[];
  pagination?: PaginationMeta;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  children?: Category[];
};

export type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  isMain: boolean;
  sortOrder: number;
};

export type ScentNote = {
  id: string;
  noteType: "TOP" | "HEART" | "BASE";
  ingredientName: string;
  intensity: number;
};

export type ProductSize = {
  id: string;
  sizeMl: number;
  price: number;
  stock: number;
};

export type ProductReview = {
  id: string;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  user: { id: string; name: string };
};

export type ProductDetail = ProductSummary & {
  images: ProductImage[];
  scentNotes: ScentNote[];
  sizes: ProductSize[];
  reviews: ProductReview[];
  relatedProducts: ProductSummary[];
};
