import { useState } from "react";

export default function ProfilePage() {
  const tabs = ["Personal Info", "Addresses", "Orders", "Loyalty Points", "Change Password"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-heading text-4xl text-accent-gold">My Profile</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded border px-3 py-2 text-sm ${
              activeTab === tab ? "border-accent-gold text-accent-gold" : "border-border text-text-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-text-secondary">{activeTab} content will be implemented in the next authentication task.</p>
      </div>
    </section>
  );
}
