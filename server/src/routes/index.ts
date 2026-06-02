import { Router } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import searchRoutes from "./search.routes.js";
import cartRoutes from "./cart.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/search", searchRoutes);
router.use("/cart", cartRoutes);

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
