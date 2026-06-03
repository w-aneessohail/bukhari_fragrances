import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchOrders } from "../../services/orderService";

const tabs = ["All", "Active", "Delivered", "Cancelled"] as const;

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

function matchesTab(status: string, tab: (typeof tabs)[number]) {
  if (tab === "All") return true;
  if (tab === "Active") {
    return ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY"].includes(status);
  }
  if (tab === "Delivered") return status === "DELIVERED";
  return status === "CANCELLED" || status === "REFUNDED";
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders
  });

  const filteredOrders = useMemo(
    () => orders.filter((order) => matchesTab(order.status, activeTab)),
    [activeTab, orders]
  );

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <h1 className="font-heading text-4xl text-accent-gold">Order history</h1>
      <p className="mt-2 text-text-secondary">Track and review your Bukhari Perfumes purchases.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded border px-3 py-2 text-sm ${
              activeTab === tab ? "border-accent-gold text-accent-gold" : "border-border text-text-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-xl bg-bg-secondary" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-text-secondary">No orders in this view.</p>
          <Link to="/shop" className="mt-6 inline-block text-accent-gold underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {filteredOrders.map((order) => (
            <li key={order.id}>
              <Link
                to={`/orders/${order.id}`}
                className="block rounded-xl border border-border bg-card p-5 transition hover:border-accent-gold"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-text-primary">{order.orderNumber}</span>
                  <span className="text-sm text-accent-gold">Rs. {order.total.toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm text-text-secondary">
                  {new Date(order.createdAt).toLocaleDateString()} · {formatStatus(order.status)} ·{" "}
                  {formatStatus(order.paymentStatus)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
