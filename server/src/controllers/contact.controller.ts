import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import { submitContactMessage } from "../services/contact.service.js";
import { sendNewsletterWelcome } from "../services/email.service.js";

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

export async function subscribeNewsletter(req: Request, res: Response) {
  await sendNewsletterWelcome(req.body.email);
  res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Subscribed successfully",
      data: { subscribed: true }
    })
  );
}
