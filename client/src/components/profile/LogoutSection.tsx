import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

export default function LogoutSection() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        Sign out of your account on this device. Your cart will remain as a guest session.
      </p>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-border px-4 py-2 text-sm text-text-primary hover:border-accent-gold hover:text-accent-gold"
      >
        Sign out
      </button>
    </div>
  );
}
