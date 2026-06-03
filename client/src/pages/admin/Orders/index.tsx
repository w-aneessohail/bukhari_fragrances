import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  exportAdminOrdersCsv,
  fetchAdminOrders,
  updateAdminOrderStatus
} from "../../../services/adminService";

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
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-orders", statusFilter, search],
    queryFn: () => fetchAdminOrders(1, 50, { status: statusFilter || undefined, search: search || undefined })
  });

  const updateMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateAdminOrderStatus(orderId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
  });

  const orders = response?.data ?? [];

  const handleExport = async () => {
    const csv = await exportAdminOrdersCsv({ status: statusFilter || undefined, search: search || undefined });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bukhari-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-accent-gold">Orders</h1>
          <p className="mt-2 text-text-secondary">Update fulfillment status for customer orders.</p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:border-accent-gold hover:text-accent-gold"
        >
          Export CSV
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-md border border-border bg-input px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {formatLabel(status)}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search order # or customer"
          className="min-w-[220px] rounded-md border border-border bg-input px-3 py-2 text-sm"
        />
      </div>

      {isLoading ? (
        <p className="mt-8 text-text-secondary">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-text-secondary">No orders found.</p>
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
