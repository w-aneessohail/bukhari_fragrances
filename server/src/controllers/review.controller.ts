import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import { HttpError } from "../utils/httpError.js";
import {
  createReview,
  deleteReview,
  getUserReviewForProduct,
  listFeaturedReviews,
  listProductReviews,
  markReviewHelpful
} from "../services/review.service.js";

export async function createReviewController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const review = await createReview(userId, req.body);
  res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Review submitted",
      data: review
    })
  );
}

export async function listProductReviewsController(req: Request, res: Response) {
  const result = await listProductReviews(req.params.productId, {
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 10),
    sort: (req.query.sort as "newest" | "highest" | "lowest" | "helpful") ?? "newest"
  });

  res.json(
    new ApiResponse({
      success: true,
      message: "Reviews retrieved",
      data: result.data,
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        totalItems: result.pagination.total,
        totalPages: result.pagination.totalPages
      }
    })
  );
}

export async function markHelpfulController(req: Request, res: Response) {
  const review = await markReviewHelpful(req.params.id);
  res.json(
    new ApiResponse({
      success: true,
      message: "Review marked helpful",
      data: review
    })
  );
}

export async function deleteReviewController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const isAdmin = req.user?.role === "ADMIN" || req.user?.role === "SUPER_ADMIN";
  await deleteReview(req.params.id, userId, isAdmin);

  res.json(
    new ApiResponse({
      success: true,
      message: "Review deleted",
      data: null
    })
  );
}

export async function featuredReviewsController(_req: Request, res: Response) {
  const reviews = await listFeaturedReviews();
  res.json(
    new ApiResponse({
      success: true,
      message: "Featured reviews retrieved",
      data: reviews
    })
  );
}

export async function myProductReviewController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const review = await getUserReviewForProduct(userId, req.params.productId);
  res.json(
    new ApiResponse({
      success: true,
      message: "Review retrieved",
      data: review
    })
  );
}
