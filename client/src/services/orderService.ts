import { api } from "./api";
import type { CheckoutSummary, CreateOrderInput, Order } from "../types/order.types";

export async function fetchCheckoutSummary() {
  const response = await api.get<{ data: CheckoutSummary }>("/orders/checkout/summary");
  return response.data.data;
}

export async function placeOrder(input: CreateOrderInput) {
  const response = await api.post<{ data: { order: Order; clientSecret: string | null } }>("/orders", input);
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
