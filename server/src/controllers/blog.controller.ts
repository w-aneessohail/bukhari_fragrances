import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPostBySlug,
  listAllBlogPosts,
  listPublishedBlogPosts
} from "../services/blog.service.js";
import { HttpError } from "../utils/httpError.js";

export async function listPublished(req: Request, res: Response) {
  const posts = await listPublishedBlogPosts();
  res.json(
    new ApiResponse({
      success: true,
      message: "Blog posts retrieved",
      data: posts
    })
  );
}

export async function getBySlug(req: Request, res: Response) {
  const post = await getBlogPostBySlug(req.params.slug);
  res.json(
    new ApiResponse({
      success: true,
      message: "Blog post retrieved",
      data: post
    })
  );
}

export async function adminList(req: Request, res: Response) {
  const posts = await listAllBlogPosts();
  res.json(
    new ApiResponse({
      success: true,
      message: "Blog posts retrieved",
      data: posts
    })
  );
}

export async function adminCreate(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const post = await createBlogPost(userId, req.body);
  res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Blog post created",
      data: post
    })
  );
}

export async function adminDelete(req: Request, res: Response) {
  await deleteBlogPost(req.params.id);
  res.json(
    new ApiResponse({
      success: true,
      message: "Blog post deleted"
    })
  );
}
