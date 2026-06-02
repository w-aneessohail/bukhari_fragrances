export type CheckoutSummary = {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
};

export type OrderItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  sizeLabel: string | null;
  image: string | null;
  lineTotal: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
};

export type CreateOrderInput = {
  paymentMethod: "COD" | "STRIPE";
  address: {
    label: string;
    street: string;
    area: string;
    city: string;
    province: string;
    postalCode: string;
  };
  saveAddress?: boolean;
  notes?: string;
};
