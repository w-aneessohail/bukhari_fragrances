import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchDashboardStats } from "../../../services/adminService";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchDashboardStats
  });

  if (isLoading || !stats) {
    return <p className="text-text-secondary">Loading dashboard…</p>;
  }

  const cards = [
    { label: "Active products", value: stats.activeProducts },
    { label: "Total orders", value: stats.totalOrders },
    { label: "Customers", value: stats.totalCustomers },
    { label: "Pending orders", value: stats.pendingOrders },
    { label: "Total revenue (PKR)", value: `Rs. ${stats.totalRevenue.toLocaleString()}` }
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl text-accent-gold">Dashboard</h1>
      <p className="mt-2 text-text-secondary">Overview of Bukhari Perfumes operations.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-6 shadow-luxury">
            <p className="text-sm text-text-secondary">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-text-primary">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/admin/orders" className="text-accent-gold underline">
          Manage orders
        </Link>
        <Link to="/admin/products" className="text-accent-gold underline">
          View products
        </Link>
        <Link to="/admin/users" className="text-accent-gold underline">
          View customers
        </Link>
      </div>
    </div>
  );
}
