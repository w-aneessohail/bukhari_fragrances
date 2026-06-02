import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchOrders } from "../../services/orderService";

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders
  });

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <h1 className="font-heading text-4xl text-accent-gold">Order history</h1>
      <p className="mt-2 text-text-secondary">Track and review your Bukhari Perfumes purchases.</p>

      {isLoading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-xl bg-bg-secondary" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-text-secondary">You have not placed any orders yet.</p>
          <Link to="/shop" className="mt-6 inline-block text-accent-gold underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
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
