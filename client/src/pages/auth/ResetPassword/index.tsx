import { useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../services/api";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    await api.post(`/auth/reset-password/${token}`, { password });
    setCompleted(true);
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-accent-gold">Reset password</h1>
      <p className="mt-2 text-sm text-text-secondary">Choose a new password for your account.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-border bg-input px-3 py-2 outline-none focus:border-accent-gold"
        />
        <button className="w-full rounded-md bg-accent-gold px-4 py-2 text-sm font-semibold text-bg-primary">
          Reset password
        </button>
      </form>
      {completed ? <p className="mt-4 text-sm text-text-secondary">Password updated successfully.</p> : null}
    </div>
  );
}
