import { useCallback, useEffect, useState, type ReactNode } from "react";
import LoadingScreen from "../ui/LoadingScreen";
import { fetchSystemHealth } from "../../services/healthService";

type GateStatus = "checking" | "ready" | "error";

type SystemHealthGateProps = {
  children: ReactNode;
};

export default function SystemHealthGate({ children }: SystemHealthGateProps) {
  const [status, setStatus] = useState<GateStatus>("checking");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0.15);

  const verifyHealth = useCallback(async () => {
    setStatus("checking");
    setProgress(0.2);
    const result = await fetchSystemHealth();

    if (result.ok) {
      setProgress(1);
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

  useEffect(() => {
    if (status !== "checking") return undefined;
    const timer = window.setInterval(() => {
      setProgress((value) => (value >= 0.88 ? 0.88 : value + 0.06));
    }, 120);
    return () => window.clearInterval(timer);
  }, [status]);

  if (status === "checking") {
    return <LoadingScreen progress={progress} visible label="Connecting" />;
  }

  if (status === "error") {
    return (
      <div className="experience-grain flex min-h-screen flex-col items-center justify-center gap-6 bg-[#050403] px-6 text-center text-[#F5EDD6]">
        <div className="site-panel max-w-md space-y-3 p-8">
          <p className="font-heading text-2xl text-[#D4AF37]">Service unavailable</p>
          <p className="text-sm text-white/60">{message}</p>
          <ul className="text-left text-xs text-white/50">
            <li>1. Start PostgreSQL on your machine</li>
            <li>2. Confirm DATABASE_URL in the project .env file</li>
            <li>3. Run npm run dev:server in a terminal</li>
          </ul>
        </div>
        <button
          type="button"
          onClick={() => void verifyHealth()}
          className="rounded-full bg-[#D4AF37] px-6 py-2 text-sm font-semibold text-[#050403] transition hover:opacity-90"
        >
          Retry connection
        </button>
      </div>
    );
  }

  return children;
}
