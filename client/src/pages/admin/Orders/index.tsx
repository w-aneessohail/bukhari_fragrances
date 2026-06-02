import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAdminOrders, updateAdminOrderStatus } from "../../../services/adminService";

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED"
] as const;

function formatLabel(value: string) {
  return value.replace(/_/g, " ");
}

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => fetchAdminOrders(1, 50)
  });

  const updateMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateAdminOrderStatus(orderId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
  });

  const orders = response?.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-3xl text-accent-gold">Orders</h1>
      <p className="mt-2 text-text-secondary">Update fulfillment status for customer orders.</p>

      {isLoading ? (
        <p className="mt-8 text-text-secondary">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-text-secondary">No orders yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-bg-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-text-secondary">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.itemCount} items
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{order.customer.name}</p>
                    <p className="text-xs text-text-secondary">{order.customer.email}</p>
                  </td>
                  <td className="px-4 py-3">Rs. {order.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {formatLabel(order.paymentMethod)} / {formatLabel(order.paymentStatus)}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      disabled={updateMutation.isPending}
                      onChange={(event) =>
                        updateMutation.mutate({ orderId: order.id, status: event.target.value })
                      }
                      className="rounded border border-border bg-input px-2 py-1 text-xs"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {formatLabel(status)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
