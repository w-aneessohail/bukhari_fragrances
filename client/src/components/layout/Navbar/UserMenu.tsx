import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "../../icons/NavIcons";
import { logoutUser } from "../../../services/authService";
import { useAuthStore } from "../../../store/authStore";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function UserMenu() {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
  const avatar = user.avatar;

  const handleLogout = async () => {
    setIsOpen(false);
    await logoutUser();
    navigate("/");
  };

  const menuItems = [
    { to: "/profile", label: "My profile" },
    { to: "/orders", label: "My orders" },
    { to: "/wishlist", label: "Wishlist" },
    { to: "/scent-diary", label: "Scent diary" },
    ...(isAdmin ? [{ to: "/admin", label: "Admin panel" }] : [])
  ];

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-1.5 py-1.5 pl-1.5 pr-2 text-sm text-text-primary transition hover:border-accent-gold"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        {avatar ? (
          <img
            src={avatar}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-gold text-xs font-semibold text-bg-primary">
            {getInitials(user.name) || "U"}
          </span>
        )}
        <span className="hidden max-w-[7rem] truncate text-xs text-text-secondary sm:inline">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDownIcon className={`text-text-secondary transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-lg border border-border bg-bg-secondary shadow-luxury"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
            <p className="truncate text-xs text-text-secondary">{user.email}</p>
          </div>

          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-text-secondary transition hover:bg-card hover:text-accent-gold"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-border py-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-sm text-text-secondary transition hover:bg-card hover:text-accent-gold"
            >
              Log out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
