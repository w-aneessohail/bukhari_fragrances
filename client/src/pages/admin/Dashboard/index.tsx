import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchDashboardStats } from "../../../services/adminService";

const pieColors = ["#B8860B", "#8B4513", "#333340", "#F5F0E8", "#1A1A2E", "#666", "#999", "#ccc"];

function ChangeBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span className={`text-xs ${positive ? "text-green-500" : "text-red-400"}`}>
      {positive ? "↑" : "↓"} {Math.abs(value)}%
    </span>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchDashboardStats
  });

  if (isLoading || !stats) {
    return <p className="text-text-secondary">Loading dashboard…</p>;
  }

  const kpiCards = [
    { label: "Revenue (MTD)", value: `Rs. ${stats.kpis.revenueMTD.toLocaleString()}`, change: stats.kpis.revenueChange },
    { label: "Orders (MTD)", value: stats.kpis.ordersMTD, change: stats.kpis.ordersChange },
    { label: "New customers (MTD)", value: stats.kpis.newCustomersMTD, change: stats.kpis.customersChange },
    { label: "Avg order value", value: `Rs. ${stats.kpis.avgOrderValue.toLocaleString()}`, change: 0 }
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-3xl text-accent-gold">Dashboard</h1>
        <p className="mt-2 text-text-secondary">Overview of Bukhari Perfumes operations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-6 shadow-luxury">
            <p className="text-sm text-text-secondary">{card.label}</p>
            <div className="mt-2 flex items-end justify-between gap-2">
              <p className="text-2xl font-semibold text-text-primary">{card.value}</p>
              {card.change !== 0 ? <ChangeBadge value={card.change} /> : null}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-xl text-text-primary">Revenue (30 days)</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.revenueByDay}>
                <XAxis dataKey="date" hide />
                <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                <Tooltip formatter={(value) => [`Rs. ${Number(value ?? 0).toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#B8860B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-xl text-text-primary">Orders by status</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.statusDistribution} dataKey="count" nameKey="status" outerRadius={100} label>
                  {stats.statusDistribution.map((entry, index) => (
                    <Cell key={entry.status} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-xl text-text-primary">Top products by revenue</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topProducts} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => `Rs. ${Number(value ?? 0).toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#B8860B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-xl text-text-primary">Low stock alerts</h2>
          {stats.lowStockProducts.length === 0 ? (
            <p className="mt-4 text-sm text-text-secondary">All products are well stocked.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {stats.lowStockProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between border-b border-border pb-2">
                  <span>{product.name}</span>
                  <span className="text-red-400">{product.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl text-text-primary">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm text-accent-gold underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-secondary">
                <th className="px-2 py-2">Order</th>
                <th className="px-2 py-2">Customer</th>
                <th className="px-2 py-2">Total</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border">
                  <td className="px-2 py-3">{order.orderNumber}</td>
                  <td className="px-2 py-3">{order.customer.name}</td>
                  <td className="px-2 py-3">Rs. {order.total.toLocaleString()}</td>
                  <td className="px-2 py-3 capitalize">{order.status.toLowerCase().replace(/_/g, " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
