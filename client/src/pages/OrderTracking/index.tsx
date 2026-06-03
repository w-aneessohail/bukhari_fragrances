import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { cancelOrder, fetchOrderTracking } from "../../services/orderService";

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order-tracking", id],
    queryFn: () => fetchOrderTracking(id!),
    enabled: Boolean(id)
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["order-tracking", id] })
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div className="h-10 w-64 animate-pulse rounded bg-bg-secondary" />
        <div className="mt-6 h-40 animate-pulse rounded-xl bg-bg-secondary" />
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <h1 className="font-heading text-3xl text-text-primary">Order not found</h1>
        <Link to="/orders" className="mt-6 inline-block text-accent-gold underline">
          Back to orders
        </Link>
      </section>
    );
  }

  const { order, timeline, canCancel } = data;

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

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-heading text-xl text-text-primary">Tracking</h2>
        <ol className="mt-6 space-y-0">
          {timeline.map((step, index) => (
            <li key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
              {index < timeline.length - 1 ? (
                <span
                  className={`absolute left-[11px] top-6 h-full w-0.5 ${
                    step.completed ? "bg-accent-gold" : "bg-border"
                  }`}
                />
              ) : null}
              <span
                className={`relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-2 ${
                  step.active
                    ? "animate-pulse border-accent-gold bg-accent-gold"
                    : step.completed
                      ? "border-accent-gold bg-accent-gold"
                      : "border-border bg-bg-secondary"
                }`}
              />
              <div>
                <p className={`font-medium ${step.completed ? "text-text-primary" : "text-text-secondary"}`}>
                  {step.label}
                </p>
                {step.timestamp ? (
                  <p className="mt-1 text-xs text-text-secondary">
                    {new Date(step.timestamp).toLocaleString()}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>

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
        {order.discount > 0 ? (
          <div className="flex justify-between text-green-600">
            <dt>Discount</dt>
            <dd>- Rs. {order.discount.toLocaleString()}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-text-secondary">Shipping</dt>
          <dd>Rs. {order.shipping.toLocaleString()}</dd>
        </div>
        <div className="flex justify-between text-lg font-semibold text-accent-gold">
          <dt>Total</dt>
          <dd>Rs. {order.total.toLocaleString()}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        {canCancel ? (
          <button
            type="button"
            disabled={cancelMutation.isPending}
            onClick={() => {
              if (window.confirm("Cancel this order? Stock will be restored.")) {
                cancelMutation.mutate();
              }
            }}
            className="rounded-lg border border-red-500/40 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
          >
            {cancelMutation.isPending ? "Cancelling…" : "Cancel order"}
          </button>
        ) : null}
        <Link to="/contact" className="rounded-lg border border-border px-4 py-2 text-sm hover:border-accent-gold hover:text-accent-gold">
          Contact support
        </Link>
        <Link to="/shop" className="rounded-lg bg-accent-gold px-4 py-2 text-sm font-medium text-bg-primary">
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
