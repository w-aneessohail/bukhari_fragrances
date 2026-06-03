import { useQuery } from "@tanstack/react-query";
import { fetchLoyaltySummary } from "../../services/loyaltyService";

export default function LoyaltyPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["loyalty-summary"],
    queryFn: fetchLoyaltySummary
  });

  if (isLoading) {
    return <div className="h-24 animate-pulse rounded-lg bg-bg-secondary" />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-heading text-xl text-accent-gold">Loyalty points</h2>
        <p className="mt-2 text-3xl font-semibold text-text-primary">{data.balance.toLocaleString()} pts</p>
        <p className="mt-1 text-sm text-text-secondary">
          Redeem {data.redemptionBlock} points for Rs. {data.redemptionValue} off at checkout.
        </p>
      </div>

      {data.transactions.length > 0 ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg text-text-primary">Recent activity</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {data.transactions.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0">
                <div>
                  <p className="text-text-primary capitalize">{entry.type.toLowerCase()}</p>
                  <p className="text-text-secondary">{entry.description ?? entry.orderNumber ?? "—"}</p>
                </div>
                <span className={entry.type === "REDEEMED" ? "text-red-400" : "text-green-500"}>
                  {entry.type === "REDEEMED" ? "-" : "+"}
                  {entry.points}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
