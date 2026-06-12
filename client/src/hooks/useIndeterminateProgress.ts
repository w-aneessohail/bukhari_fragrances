import { useEffect, useState } from "react";

/** Smooth progress bar for loading screens without a real completion signal. */
export function useIndeterminateProgress() {
  const [progress, setProgress] = useState(0.12);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((value) => (value >= 0.9 ? 0.9 : value + 0.07));
    }, 90);
    return () => window.clearInterval(timer);
  }, []);

  return progress;
}
