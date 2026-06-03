import { Router } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import searchRoutes from "./search.routes.js";
import cartRoutes from "./cart.routes.js";
import wishlistRoutes from "./wishlist.routes.js";
import orderRoutes from "./order.routes.js";
import contactRoutes from "./contact.routes.js";
import adminRoutes from "./admin.routes.js";
import userRoutes from "./user.routes.js";
import blogRoutes from "./blog.routes.js";
import reviewRoutes from "./review.routes.js";
import scentDiaryRoutes from "./scentDiary.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/search", searchRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/orders", orderRoutes);
router.use("/contact", contactRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/blog", blogRoutes);
router.use("/reviews", reviewRoutes);
router.use("/scent-diary", scentDiaryRoutes);

router.get("/health", (_req, res) => {
  res.json(
    new ApiResponse({
      success: true,
      message: "Bukhari Perfumes API is healthy",
      data: {
        status: "ok",
        service: "bukhari-perfumes-server",
        timestamp: new Date().toISOString()
      }
    })
  );
});

export default router;
