import { useState } from "react";
import { api } from "../../services/api";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    try {
      await api.post("/contact/subscribe", { email });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-bg-secondary py-16">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <h2 className="font-heading text-3xl text-accent-gold">Stay in the circle</h2>
        <p className="mt-2 text-text-secondary">
          New arrivals, exclusive offers, and scent guides — delivered to your inbox.
        </p>

        {status === "success" ? (
          <p className="mt-8 text-lg text-accent-gold">Thank you for subscribing.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className="min-w-0 flex-1 rounded-lg border border-border bg-input px-4 py-3"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-accent-gold px-6 py-3 font-medium text-bg-primary disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" ? (
          <p className="mt-3 text-sm text-red-500">Could not subscribe. Please try again.</p>
        ) : null}
      </div>
    </section>
  );
}
