import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuthStore } from "../store/authStore";

const adminLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/discounts", label: "Discounts" }
];

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="text-sm text-text-secondary">Signed in as</p>
            <p className="font-medium text-text-primary">{user?.name ?? "Admin"}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded border border-border px-4 py-2 text-sm text-text-secondary hover:border-accent-gold hover:text-accent-gold"
          >
            Sign out
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
