import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory
} from "../services/category.service.js";

export async function listCategories(_req: Request, res: Response) {
  const categories = await getCategories();
  res.json(new ApiResponse({ success: true, message: "Categories fetched successfully", data: categories }));
}

export async function getCategory(req: Request, res: Response) {
  const category = await getCategoryBySlug(req.params.slug);
  res.json(new ApiResponse({ success: true, message: "Category fetched successfully", data: category }));
}

export async function createCategoryController(req: Request, res: Response) {
  const category = await createCategory(req.body);
  res.status(201).json(new ApiResponse({ success: true, message: "Category created successfully", data: category }));
}

export async function updateCategoryController(req: Request, res: Response) {
  const category = await updateCategory(req.params.id, req.body);
  res.json(new ApiResponse({ success: true, message: "Category updated successfully", data: category }));
}

export async function deleteCategoryController(req: Request, res: Response) {
  await deleteCategory(req.params.id);
  res.json(new ApiResponse({ success: true, message: "Category deleted successfully" }));
}
