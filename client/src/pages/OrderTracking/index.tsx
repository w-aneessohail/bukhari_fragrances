import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchOrder } from "../../services/orderService";

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id!),
    enabled: Boolean(id)
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div className="h-10 w-64 animate-pulse rounded bg-bg-secondary" />
        <div className="mt-6 h-40 animate-pulse rounded-xl bg-bg-secondary" />
      </section>
    );
  }

  if (isError || !order) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <h1 className="font-heading text-3xl text-text-primary">Order not found</h1>
        <Link to="/orders" className="mt-6 inline-block text-accent-gold underline">
          Back to orders
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <Link to="/orders" className="text-sm text-text-secondary underline hover:text-accent-gold">
        ← All orders
      </Link>

      <h1 className="mt-4 font-heading text-3xl text-accent-gold">{order.orderNumber}</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Placed {new Date(order.createdAt).toLocaleString()} · {formatStatus(order.status)} · Payment:{" "}
        {formatStatus(order.paymentStatus)}
      </p>

      {order.notes ? (
        <pre className="mt-6 whitespace-pre-wrap rounded-lg border border-border bg-card p-4 text-sm text-text-secondary">
          {order.notes}
        </pre>
      ) : null}

      <ul className="mt-8 space-y-4">
        {order.items.map((item) => (
          <li key={item.id} className="flex gap-4 rounded-xl border border-border bg-card p-4">
            {item.image ? (
              <img src={item.image} alt={item.name} className="h-20 w-16 rounded object-cover" />
            ) : (
              <div className="flex h-20 w-16 items-center justify-center rounded bg-bg-secondary text-xs">—</div>
            )}
            <div className="flex-1">
              <Link to={`/product/${item.slug}`} className="font-medium hover:text-accent-gold">
                {item.name}
              </Link>
              {item.sizeLabel ? <p className="text-sm text-text-secondary">{item.sizeLabel}</p> : null}
              <p className="mt-1 text-sm">
                {item.quantity} × Rs. {item.price.toLocaleString()} = Rs. {item.lineTotal.toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-8 space-y-2 border-t border-border pt-6 text-sm">
        <div className="flex justify-between">
          <dt className="text-text-secondary">Subtotal</dt>
          <dd>Rs. {order.subtotal.toLocaleString()}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-secondary">Shipping</dt>
          <dd>Rs. {order.shipping.toLocaleString()}</dd>
        </div>
        <div className="flex justify-between text-lg font-semibold text-accent-gold">
          <dt>Total</dt>
          <dd>Rs. {order.total.toLocaleString()}</dd>
        </div>
      </dl>
    </section>
  );
}
