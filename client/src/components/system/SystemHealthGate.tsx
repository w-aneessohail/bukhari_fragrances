import { useCallback, useEffect, useState, type ReactNode } from "react";
import { fetchSystemHealth } from "../../services/healthService";

type GateStatus = "checking" | "ready" | "error";

type SystemHealthGateProps = {
  children: ReactNode;
};

export default function SystemHealthGate({ children }: SystemHealthGateProps) {
  const [status, setStatus] = useState<GateStatus>("checking");
  const [message, setMessage] = useState("");

  const verifyHealth = useCallback(async () => {
    setStatus("checking");
    const result = await fetchSystemHealth();

    if (result.ok) {
      setStatus("ready");
      setMessage("");
      return;
    }

    setStatus("error");
    setMessage(result.message);
  }, []);

  useEffect(() => {
    void verifyHealth();
  }, [verifyHealth]);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg-primary px-6 text-center">
        <p className="font-heading text-xl text-accent-gold">Bukhari Perfumes</p>
        <p className="text-sm text-text-secondary">Checking database connection…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg-primary px-6 text-center">
        <div className="max-w-md space-y-3">
          <p className="font-heading text-2xl text-accent-gold">Service unavailable</p>
          <p className="text-sm text-text-secondary">{message}</p>
          <ul className="text-left text-xs text-text-secondary">
            <li>1. Start PostgreSQL on your machine</li>
            <li>2. Confirm DATABASE_URL in the project .env file</li>
            <li>3. Run npm run dev:server in a terminal</li>
          </ul>
        </div>
        <button
          type="button"
          onClick={() => void verifyHealth()}
          className="rounded-full bg-accent-gold px-6 py-2 text-sm font-semibold text-bg-primary transition hover:opacity-90"
        >
          Retry connection
        </button>
      </div>
    );
  }

  return children;
}
