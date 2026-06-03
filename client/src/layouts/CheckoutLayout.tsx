import { Outlet } from "react-router-dom";
import { useCheckoutStore } from "../store/checkoutStore";

const steps = ["Address", "Payment", "Review", "Confirm"] as const;

export default function CheckoutLayout() {
  const step = useCheckoutStore((state) => state.step);

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8 text-text-primary">
      <div className="mx-auto max-w-5xl">
        <ol className="mb-8 grid grid-cols-4 gap-2">
          {steps.map((label, index) => {
            const stepNumber = (index + 1) as 1 | 2 | 3 | 4;
            const isActive = step === stepNumber;
            const isComplete = step > stepNumber;

            return (
              <li
                key={label}
                className={`rounded border px-2 py-2 text-center text-xs ${
                  isActive || isComplete
                    ? "border-accent-gold text-accent-gold"
                    : "border-border text-text-secondary"
                }`}
              >
                {index + 1}. {label}
              </li>
            );
          })}
        </ol>

        <div className="rounded-xl border border-border bg-card p-6 shadow-luxury">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
