import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import zxcvbn from "zxcvbn";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

const registerSchema = z
  .object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    acceptTerms: z.literal(true)
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const navigate = useNavigate();
  const { setUser, setAccessToken, isLoading, setLoading } = useAuthStore();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: true
    }
  });

  const password = form.watch("password");
  const strength = zxcvbn(password || "").score;
  const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"][strength];

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password
      });
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
    <div>
      <h1 className="font-heading text-3xl text-accent-gold">Create account</h1>
      <p className="mt-2 text-sm text-text-secondary">Join Bukhari Perfumes and discover your signature scent.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Full name"
          className="w-full rounded-md border border-border bg-input px-3 py-2 outline-none focus:border-accent-gold"
          {...form.register("name")}
        />
        <input
          type="email"
          placeholder="Email address"
          className="w-full rounded-md border border-border bg-input px-3 py-2 outline-none focus:border-accent-gold"
          {...form.register("email")}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-md border border-border bg-input px-3 py-2 outline-none focus:border-accent-gold"
          {...form.register("password")}
        />
        <div className="text-xs text-text-secondary">Password strength: {strengthLabel}</div>
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full rounded-md border border-border bg-input px-3 py-2 outline-none focus:border-accent-gold"
          {...form.register("confirmPassword")}
        />
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" {...form.register("acceptTerms")} />
          I agree to the terms and privacy policy.
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-accent-gold px-4 py-2 text-sm font-semibold text-bg-primary transition hover:opacity-90 disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-text-secondary">
        Already have an account?{" "}
        <Link to="/login" className="text-accent-gold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
