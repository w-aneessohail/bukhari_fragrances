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
  children?: Category[];
};
