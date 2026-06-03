import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import {
  createOrderFromCart,
  cancelUserOrder,
  getCheckoutSummary,
  getOrderTracking,
  getUserOrder,
  listUserOrders
} from "../services/order.service.js";
import { HttpError } from "../utils/httpError.js";

export async function checkoutSummary(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const summary = await getCheckoutSummary(userId);
  res.json(
    new ApiResponse({
      success: true,
      message: "Checkout summary retrieved",
      data: summary
    })
  );
}

export async function createOrder(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const result = await createOrderFromCart(userId, req.body);
  res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Order placed successfully",
      data: result
    })
  );
}

export async function listOrders(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const orders = await listUserOrders(userId);
  res.json(
    new ApiResponse({
      success: true,
      message: "Orders retrieved",
      data: orders
    })
  );
}

export async function getOrder(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const order = await getUserOrder(userId, req.params.id);
  res.json(
    new ApiResponse({
      success: true,
      message: "Order retrieved",
      data: order
    })
  );
}

export async function trackOrder(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const tracking = await getOrderTracking(userId, req.params.id);
  res.json(
    new ApiResponse({
      success: true,
      message: "Order tracking retrieved",
      data: tracking
    })
  );
}

export async function cancelOrder(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const tracking = await cancelUserOrder(userId, req.params.id);
  res.json(
    new ApiResponse({
      success: true,
      message: "Order cancelled",
      data: tracking
    })
  );
}
