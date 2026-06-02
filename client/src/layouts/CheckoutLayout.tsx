import { Outlet } from "react-router-dom";

const steps = ["Address", "Payment", "Review", "Confirm"];

export default function CheckoutLayout() {
  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8 text-text-primary">
      <div className="mx-auto max-w-4xl">
        <ol className="mb-8 grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <li
              key={step}
              className={`rounded border px-2 py-2 text-center text-xs ${
                index === 0 ? "border-accent-gold text-accent-gold" : "border-border text-text-secondary"
              }`}
            >
              {index + 1}. {step}
            </li>
          ))}
        </ol>

        <div className="rounded-xl border border-border bg-card p-6 shadow-luxury">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
