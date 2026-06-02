import { Router } from "express";
import { ApiResponse } from "../utils/response.utils.js";

const router = Router();

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
