import { useState } from "react";
import { api } from "../../services/api";

type NewsletterSectionProps = {
  tone?: "default" | "experience";
};

export default function NewsletterSection({ tone = "experience" }: NewsletterSectionProps) {
  const isExperience = tone === "experience";
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
    <section
      className={`py-16 ${isExperience ? "border-b border-border bg-transparent" : "bg-bg-secondary"}`}
    >
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
              className="min-w-0 flex-1 rounded-lg border border-border bg-input px-4 py-3 text-text-primary placeholder:text-text-secondary"
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
