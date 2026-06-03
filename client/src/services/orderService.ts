import { api } from "./api";
import type { CheckoutSummary, CreateOrderInput, Order } from "../types/order.types";

export async function fetchCheckoutSummary() {
  const response = await api.get<{ data: CheckoutSummary }>("/orders/checkout/summary");
  return response.data.data;
}

export async function placeOrder(input: CreateOrderInput) {
  const response = await api.post<{
    data: {
      order: Order;
      clientSecret: string | null;
      jazzCashRedirect?: { redirectUrl: string; formFields: Record<string, string> } | null;
    };
  }>("/orders", input);
  return response.data.data;
}

export async function fetchOrders() {
  const response = await api.get<{ data: Order[] }>("/orders");
  return response.data.data;
}

export async function fetchOrder(orderId: string) {
  const response = await api.get<{ data: Order }>(`/orders/${orderId}`);
  return response.data.data;
}

export type OrderTimelineStep = {
  status: string;
  label: string;
  icon: string;
  completed: boolean;
  active: boolean;
  timestamp: string | null;
};

export type OrderTracking = {
  order: Order;
  timeline: OrderTimelineStep[];
  canCancel: boolean;
};

export async function fetchOrderTracking(orderId: string) {
  const response = await api.get<{ data: OrderTracking }>(`/orders/${orderId}/track`);
  return response.data.data;
}

export async function cancelOrder(orderId: string) {
  const response = await api.post<{ data: OrderTracking }>(`/orders/${orderId}/cancel`);
  return response.data.data;
}
