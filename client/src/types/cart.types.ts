export type CartItem = {
  id: string;
  productId: string;
  sizeId: string | null;
  quantity: number;
  price: number;
  lineTotal: number;
  product: {
    id: string;
    name: string;
    slug: string;
    stock: number;
    mainImage: string | null;
  };
  size: {
    id: string;
    sizeMl: number;
    stock: number;
  } | null;
};

export type Cart = {
  id: string | null;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  discount: number;
  shipping: number;
  total: number;
  discountCode: string | null;
};
