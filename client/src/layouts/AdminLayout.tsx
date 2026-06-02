import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const adminLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/blog", label: "Blog" }
];

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary md:flex">
      <aside
        className={`border-r border-border bg-bg-secondary p-4 transition-all ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          {!isCollapsed && <p className="font-heading text-xl text-accent-gold">Admin</p>}
          <button
            type="button"
            onClick={() => setIsCollapsed((value) => !value)}
            className="rounded border border-border px-2 py-1 text-xs"
          >
            {isCollapsed ? ">" : "<"}
          </button>
        </div>

        <nav className="space-y-2">
          <Link to="/" className="mb-4 block rounded px-3 py-2 text-sm text-text-secondary hover:text-accent-gold">
            {isCollapsed ? "←" : "← Back to store"}
          </Link>

          {adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block rounded px-3 py-2 text-sm hover:bg-card ${
                location.pathname === link.to
                  ? "bg-card text-accent-gold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {isCollapsed ? link.label[0] : link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
