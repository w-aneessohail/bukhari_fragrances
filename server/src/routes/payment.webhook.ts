import type { Request, Response } from "express";
import { stripeWebhookController } from "../controllers/payment.controller.js";

export async function stripeWebhookHandler(req: Request, res: Response) {
  await stripeWebhookController(req, res);
}
