import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import {
  getDashboardStats,
  exportOrdersCsv,
  listAllOrders,
  listUsers,
  updateOrderStatus
} from "../services/admin.service.js";
import { getAdminProducts } from "../services/product.service.js";

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

export async function listAdminProducts(req: Request, res: Response) {
  const result = await getAdminProducts(req.query);
  res.json(
    new ApiResponse({
      success: true,
      message: "Products retrieved",
      data: result.items,
      pagination: result.pagination
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

export async function exportOrdersController(req: Request, res: Response) {
  const csv = await exportOrdersCsv({
    status: typeof req.query.status === "string" ? req.query.status : undefined,
    search: typeof req.query.search === "string" ? req.query.search : undefined
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="bukhari-orders.csv"');
  res.send(csv);
}
