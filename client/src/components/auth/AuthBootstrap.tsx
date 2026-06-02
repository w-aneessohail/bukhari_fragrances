import { useEffect, useState, type ReactNode } from "react";
import { bootstrapSession } from "../../services/authService";

type AuthBootstrapProps = {
  children: ReactNode;
};

export default function AuthBootstrap({ children }: AuthBootstrapProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    bootstrapSession().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary text-text-secondary">
        Loading…
      </div>
    );
  }

  return children;
}
