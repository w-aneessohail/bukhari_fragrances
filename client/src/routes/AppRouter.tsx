import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RouteLoadingFallback from "../components/ui/RouteLoadingFallback";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import CheckoutLayout from "../layouts/CheckoutLayout";
import MainLayout from "../layouts/MainLayout";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";

const HomeIndexRedirect = lazy(() => import("../pages/Home"));
const ClassicHomePage = lazy(() => import("../pages/Home/ClassicHome"));
const ExperienceHomePage = lazy(() => import("../pages/Home/ExperienceHome"));
const ModernHomePage = lazy(() => import("../pages/Home/ModernHome"));
const ShopPage = lazy(() => import("../pages/Shop"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetail"));
const AboutPage = lazy(() => import("../pages/About"));
const ContactPage = lazy(() => import("../pages/Contact"));
const BlogPage = lazy(() => import("../pages/Blog"));
const BlogPostPage = lazy(() => import("../pages/BlogPost"));
const LoginPage = lazy(() => import("../pages/auth/Login"));
const RegisterPage = lazy(() => import("../pages/auth/Register"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPassword"));
const CartPage = lazy(() => import("../pages/Cart"));
const CheckoutPage = lazy(() => import("../pages/Checkout"));
const OrdersPage = lazy(() => import("../pages/Orders"));
const OrderTrackingPage = lazy(() => import("../pages/OrderTracking"));
const ProfilePage = lazy(() => import("../pages/Profile"));
const WishlistPage = lazy(() => import("../pages/Wishlist"));
const ScentDiaryPage = lazy(() => import("../pages/ScentDiary"));
const GiftBuilderPage = lazy(() => import("../pages/GiftBuilder"));
const AdminLoginPage = lazy(() => import("../pages/admin/Login"));
const AdminDashboardPage = lazy(() => import("../pages/admin/Dashboard"));
const AdminProductsPage = lazy(() => import("../pages/admin/Products"));
const AdminOrdersPage = lazy(() => import("../pages/admin/Orders"));
const AdminUsersPage = lazy(() => import("../pages/admin/Users"));
const AdminBlogPage = lazy(() => import("../pages/admin/Blog"));
const AdminDiscountsPage = lazy(() => import("../pages/admin/Discounts"));
const SearchPage = lazy(() => import("../pages/Search"));
const OfflinePage = lazy(() => import("../pages/Offline"));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomeIndexRedirect />} />
            <Route path="home-classic" element={<ClassicHomePage />} />
            <Route path="home-experience" element={<ExperienceHomePage />} />
            <Route path="home-modern" element={<ModernHomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="offline" element={<OfflinePage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogPostPage />} />
            <Route path="cart" element={<CartPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderTrackingPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="scent-diary" element={<ScentDiaryPage />} />
              <Route path="gift-builder" element={<GiftBuilderPage />} />
            </Route>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password/:token" element={<ResetPasswordPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<CheckoutLayout />}>
              <Route path="checkout" element={<CheckoutPage />} />
            </Route>
          </Route>

          <Route path="admin/login" element={<AdminLoginPage />} />

          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="blog" element={<AdminBlogPage />} />
              <Route path="discounts" element={<AdminDiscountsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
