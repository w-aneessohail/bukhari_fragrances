import { Outlet } from "react-router-dom";
import BrandIconBrown from "../components/brand/BrandIconBrown";
import BrandWordmark from "../components/brand/BrandWordmark";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="site-panel w-full max-w-md p-8 md:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandIconBrown size="lg" className="mb-4" />
          <BrandWordmark size="md" />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
