import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitContactMessage } from "../../services/contactService";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null);
    try {
      await submitContactMessage(values);
      setSubmitted(true);
      reset();
    } catch {
      setSubmitError("Could not send your message. Please try again later.");
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="font-heading text-4xl text-accent-gold">Contact us</h1>
      <p className="mt-3 text-text-secondary">
        Questions about an order, a fragrance, or wholesale? Send us a message and we will respond within one business
        day.
      </p>

      {submitted ? (
        <p className="mt-8 rounded-lg border border-accent-gold bg-card p-4 text-accent-gold">
          Thank you — your message has been received.
        </p>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <label className="block text-sm">
          <span className="text-text-secondary">Name</span>
          <input
            {...register("name")}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
          {errors.name ? <span className="mt-1 text-xs text-red-500">{errors.name.message}</span> : null}
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">Email</span>
          <input
            type="email"
            {...register("email")}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
          {errors.email ? <span className="mt-1 text-xs text-red-500">{errors.email.message}</span> : null}
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">Subject</span>
          <input
            {...register("subject")}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
          {errors.subject ? <span className="mt-1 text-xs text-red-500">{errors.subject.message}</span> : null}
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">Message</span>
          <textarea
            rows={5}
            {...register("message")}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
          {errors.message ? <span className="mt-1 text-xs text-red-500">{errors.message.message}</span> : null}
        </label>

        {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-accent-gold px-8 py-3 font-medium text-bg-primary disabled:opacity-50"
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </button>
      </form>
    </section>
  );
}
