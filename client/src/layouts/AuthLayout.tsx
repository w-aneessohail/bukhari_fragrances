import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-luxury">
        <Outlet />
      </div>
    </div>
  );
}
