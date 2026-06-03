import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import {
  createDiscount,
  deleteDiscount,
  listDiscounts,
  updateDiscount
} from "../services/discount.service.js";

export async function listDiscountsController(_req: Request, res: Response) {
  const discounts = await listDiscounts();
  res.json(
    new ApiResponse({
      success: true,
      message: "Discounts retrieved",
      data: discounts
    })
  );
}

export async function createDiscountController(req: Request, res: Response) {
  const discount = await createDiscount(req.body);
  res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Discount created",
      data: discount
    })
  );
}

export async function updateDiscountController(req: Request, res: Response) {
  const discount = await updateDiscount(req.params.id, req.body);
  res.json(
    new ApiResponse({
      success: true,
      message: "Discount updated",
      data: discount
    })
  );
}

export async function deleteDiscountController(req: Request, res: Response) {
  await deleteDiscount(req.params.id);
  res.json(
    new ApiResponse({
      success: true,
      message: "Discount deleted",
      data: null
    })
  );
}
