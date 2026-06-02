import { useState } from "react";
import { changePassword } from "../../services/userService";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      await changePassword(currentPassword, newPassword);
      setMessage("Password updated. Please sign in again on your next visit if sessions expire.");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setError("Could not update password. Check your current password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <label className="block text-sm">
        <span className="text-text-secondary">Current password</span>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        <span className="text-text-secondary">New password</span>
        <input
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
        />
      </label>
      {message ? <p className="text-sm text-accent-gold">{message}</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-accent-gold px-6 py-2 text-sm font-medium text-bg-primary disabled:opacity-50"
      >
        Update password
      </button>
    </form>
  );
}
