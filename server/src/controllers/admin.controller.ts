import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import {
  getDashboardStats,
  listAllOrders,
  listUsers,
  updateOrderStatus
} from "../services/admin.service.js";

export async function dashboardStats(_req: Request, res: Response) {
  const stats = await getDashboardStats();
  res.json(
    new ApiResponse({
      success: true,
      message: "Dashboard stats retrieved",
      data: stats
    })
  );
}

export async function listOrders(req: Request, res: Response) {
  const result = await listAllOrders(req.query);
  res.json(
    new ApiResponse({
      success: true,
      message: "Orders retrieved",
      data: result.items,
      pagination: result.pagination
    })
  );
}

export async function patchOrderStatus(req: Request, res: Response) {
  const order = await updateOrderStatus(req.params.id, req.body.status);
  res.json(
    new ApiResponse({
      success: true,
      message: "Order status updated",
      data: order
    })
  );
}

export async function listUsersController(req: Request, res: Response) {
  const result = await listUsers(req.query);
  res.json(
    new ApiResponse({
      success: true,
      message: "Users retrieved",
      data: result.items,
      pagination: result.pagination
    })
  );
}
