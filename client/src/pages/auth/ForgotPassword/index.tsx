import { useState, type FormEvent } from "react";
import { api } from "../../../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await api.post("/auth/forgot-password", { email });
    setSubmitted(true);
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-accent-gold">Forgot password</h1>
      <p className="mt-2 text-sm text-text-secondary">We will send reset instructions to your email.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-border bg-input px-3 py-2 outline-none focus:border-accent-gold"
        />
        <button className="w-full rounded-md bg-accent-gold px-4 py-2 text-sm font-semibold text-bg-primary">
          Send reset link
        </button>
      </form>
      {submitted ? <p className="mt-4 text-sm text-text-secondary">If your account exists, an email was sent.</p> : null}
    </div>
  );
}
