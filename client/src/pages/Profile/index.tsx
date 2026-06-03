import { useState } from "react";
import { Link } from "react-router-dom";
import AddressManager from "../../components/profile/AddressManager";
import ChangePasswordForm from "../../components/profile/ChangePasswordForm";
import LogoutSection from "../../components/profile/LogoutSection";
import { useAuthStore } from "../../store/authStore";

const tabs = ["Personal Info", "Addresses", "Orders", "Security"] as const;

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Personal Info");

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="font-heading text-4xl text-accent-gold">My profile</h1>
      <p className="mt-2 text-text-secondary">Manage your account and view your activity.</p>

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

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        {activeTab === "Personal Info" ? (
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-text-secondary">Name</dt>
              <dd className="mt-1 text-lg text-text-primary">{user?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-text-secondary">Email</dt>
              <dd className="mt-1 text-text-primary">{user?.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-text-secondary">Account type</dt>
              <dd className="mt-1 capitalize text-text-primary">
                {user?.role?.toLowerCase().replace(/_/g, " ") ?? "—"}
              </dd>
            </div>
          </dl>
        ) : null}

        {activeTab === "Addresses" ? <AddressManager /> : null}

        {activeTab === "Orders" ? (
          <div>
            <p className="text-text-secondary">View your order history and track shipments.</p>
            <Link to="/orders" className="mt-4 inline-block text-accent-gold underline">
              Go to order history
            </Link>
          </div>
        ) : null}

        {activeTab === "Security" ? (
          <div className="space-y-8">
            <ChangePasswordForm />
            <div className="border-t border-border pt-8">
              <h2 className="font-heading text-xl text-text-primary">Session</h2>
              <div className="mt-4">
                <LogoutSection />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
