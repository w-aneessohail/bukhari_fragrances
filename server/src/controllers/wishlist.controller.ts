import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import {
  addToWishlist,
  getWishlist,
  isProductInWishlist,
  removeFromWishlist
} from "../services/wishlist.service.js";
import { HttpError } from "../utils/httpError.js";

export async function listWishlist(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const items = await getWishlist(userId);
  res.json(
    new ApiResponse({
      success: true,
      message: "Wishlist retrieved",
      data: items
    })
  );
}

export async function addWishlistItem(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const items = await addToWishlist(userId, req.body.productId);
  res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Added to wishlist",
      data: items
    })
  );
}

export async function removeWishlistItem(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const items = await removeFromWishlist(userId, req.params.productId);
  res.json(
    new ApiResponse({
      success: true,
      message: "Removed from wishlist",
      data: items
    })
  );
}

export async function checkWishlistItem(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const inWishlist = await isProductInWishlist(userId, req.params.productId);
  res.json(
    new ApiResponse({
      success: true,
      message: "Wishlist status retrieved",
      data: { inWishlist }
    })
  );
}
