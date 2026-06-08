import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
import { logoutUser } from "../../../services/authService";
import { useAuthStore } from "../../../store/authStore";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { setUser, setAccessToken, isLoading, setLoading } = useAuthStore();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", values);
      const user = response.data?.data?.user;
      const accessToken = response.data?.data?.accessToken;

      if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
        form.setError("email", {
          message: "This account does not have admin access."
        });
        await logoutUser();
        return;
      }

      setUser(user);
      setAccessToken(accessToken ?? null);
      navigate("/admin", { replace: true });
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md rounded-xl border border-border bg-bg-secondary p-8 shadow-luxury"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">Bukhari Perfumes</p>
        <h1 className="mt-2 font-heading text-3xl text-text-primary">Admin sign in</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Staff portal for managing products, orders, and content.
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm text-text-secondary" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              className="w-full rounded-md border border-border bg-input px-3 py-2 outline-none focus:border-accent-gold"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="mt-1 text-xs text-red-400">{form.formState.errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm text-text-secondary" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-md border border-border bg-input px-3 py-2 outline-none focus:border-accent-gold"
              {...form.register("password")}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-accent-gold px-4 py-2 text-sm font-semibold text-bg-primary transition hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Enter admin panel"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2 text-sm text-text-secondary">
          <Link to="/" className="hover:text-accent-gold">
            ← Back to storefront
          </Link>
          <Link to="/login" className="hover:text-accent-gold">
            Customer login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
