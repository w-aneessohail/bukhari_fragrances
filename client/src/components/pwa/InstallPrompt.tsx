import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const dismissed = localStorage.getItem("pwa-install-dismissed") === "1";
    if (!isMobile || dismissed) return;

    const timer = window.setTimeout(() => setVisible(true), 30_000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-border bg-card p-4 shadow-luxury md:left-auto md:right-4 md:max-w-sm">
      <p className="font-heading text-lg text-accent-gold">Add Bukhari Perfumes</p>
      <p className="mt-1 text-sm text-text-secondary">Install the app for quick access from your home screen.</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="rounded-lg bg-accent-gold px-4 py-2 text-sm font-medium text-bg-primary"
          onClick={() => {
            localStorage.setItem("pwa-install-dismissed", "1");
            setVisible(false);
          }}
        >
          Got it
        </button>
        <button
          type="button"
          className="rounded-lg border border-border px-4 py-2 text-sm"
          onClick={() => {
            localStorage.setItem("pwa-install-dismissed", "1");
            setVisible(false);
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
