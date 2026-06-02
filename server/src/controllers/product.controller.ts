import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import {
  createProduct,
  deleteProduct,
  getBestsellerProducts,
  getFeaturedProducts,
  getNewArrivalProducts,
  getProductBySlug,
  getProducts,
  searchProducts,
  updateProduct,
  uploadProductImages
} from "../services/product.service.js";
import { HttpError } from "../utils/httpError.js";

export async function listProducts(req: Request, res: Response) {
  const result = await getProducts(req.query);
  res.json(
    new ApiResponse({
      success: true,
      message: "Products fetched successfully",
      data: result.items,
      pagination: result.pagination
    })
  );
}

export async function getFeatured(req: Request, res: Response) {
  const products = await getFeaturedProducts();
  res.json(new ApiResponse({ success: true, message: "Featured products fetched", data: products }));
}

export async function getBestsellers(req: Request, res: Response) {
  const products = await getBestsellerProducts();
  res.json(new ApiResponse({ success: true, message: "Bestseller products fetched", data: products }));
}

export async function getNewArrivals(req: Request, res: Response) {
  const products = await getNewArrivalProducts();
  res.json(new ApiResponse({ success: true, message: "New arrivals fetched", data: products }));
}

export async function getBySlug(req: Request, res: Response) {
  const product = await getProductBySlug(req.params.slug);
  res.json(new ApiResponse({ success: true, message: "Product fetched successfully", data: product }));
}

export async function createProductController(req: Request, res: Response) {
  const product = await createProduct(req.body);
  res.status(201).json(new ApiResponse({ success: true, message: "Product created successfully", data: product }));
}

export async function updateProductController(req: Request, res: Response) {
  const product = await updateProduct(req.params.id, req.body);
  res.json(new ApiResponse({ success: true, message: "Product updated successfully", data: product }));
}

export async function deleteProductController(req: Request, res: Response) {
  await deleteProduct(req.params.id);
  res.json(new ApiResponse({ success: true, message: "Product deactivated successfully" }));
}

export async function uploadImagesController(req: Request, res: Response) {
  if (!req.uploadedFiles?.length) {
    throw new HttpError("No images uploaded", 400);
  }

  const images = await uploadProductImages(req.params.id, req.uploadedFiles);
  res.json(new ApiResponse({ success: true, message: "Product images uploaded", data: images }));
}

export async function searchProductsController(req: Request, res: Response) {
  const query = String(req.query.q);
  const page = req.query.page ? String(req.query.page) : undefined;
  const limit = req.query.limit ? String(req.query.limit) : undefined;
  const result = await searchProducts(query, page, limit);
  res.json(
    new ApiResponse({
      success: true,
      message: "Search results fetched",
      data: result.items,
      pagination: result.pagination
    })
  );
}
