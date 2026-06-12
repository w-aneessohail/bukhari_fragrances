import { useEffect, useState, type ReactNode } from "react";
import { bootstrapSession } from "../../services/authService";
import LoadingScreen from "../ui/LoadingScreen";

type AuthBootstrapProps = {
  children: ReactNode;
};

export default function AuthBootstrap({ children }: AuthBootstrapProps) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0.2);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((value) => (value >= 0.85 ? 0.85 : value + 0.05));
    }, 100);

    bootstrapSession().finally(() => {
      window.clearInterval(timer);
      setProgress(1);
      setReady(true);
    });

    return () => window.clearInterval(timer);
  }, []);

  if (!ready) {
    return <LoadingScreen progress={progress} visible label="Loading" />;
  }

  return children;
}
