import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import { submitContactMessage } from "../services/contact.service.js";

export async function submitContact(req: Request, res: Response) {
  const result = await submitContactMessage(req.body);
  res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Message sent successfully",
      data: result
    })
  );
}
