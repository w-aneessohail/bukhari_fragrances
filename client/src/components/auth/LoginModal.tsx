import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuthButton from "./GoogleAuthButton";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginModal() {
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
      setUser(user ?? null);
      setAccessToken(accessToken ?? null);
      navigate("/");
    } finally {
      setLoading(false);
    }
  });

  return (
    <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
      <h1 className="font-heading text-3xl text-accent-gold">Welcome back</h1>
      <p className="mt-2 text-sm text-text-secondary">Sign in to your Bukhari Perfumes account.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-sm text-text-secondary" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-border bg-input px-3 py-2 outline-none focus:border-accent-gold"
            {...form.register("email")}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-text-secondary" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-border bg-input px-3 py-2 outline-none focus:border-accent-gold"
            {...form.register("password")}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-accent-gold px-4 py-2 text-sm font-semibold text-bg-primary transition hover:opacity-90 disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="my-4 text-center text-xs text-text-secondary">or</div>
      <GoogleAuthButton />

      <div className="mt-6 flex items-center justify-between text-sm text-text-secondary">
        <Link to="/register" className="hover:text-accent-gold">
          Create account
        </Link>
        <Link to="/forgot-password" className="hover:text-accent-gold">
          Forgot password?
        </Link>
      </div>
    </motion.div>
  );
}
