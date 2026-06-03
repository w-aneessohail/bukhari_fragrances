import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import { HttpError } from "../utils/httpError.js";
import {
  createStripePaymentIntent,
  handleStripeWebhook,
  initiateJazzCashPayment,
  verifyJazzCashCallback
} from "../services/payment.service.js";

export async function stripeIntentController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const result = await createStripePaymentIntent(req.body.orderId);
  res.json(
    new ApiResponse({
      success: true,
      message: "Payment intent created",
      data: result
    })
  );
}

export async function stripeWebhookController(req: Request, res: Response) {
  const result = await handleStripeWebhook(req.body as Buffer, req.headers["stripe-signature"] as string | undefined);
  res.json(result);
}

export async function jazzCashInitiateController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const result = await initiateJazzCashPayment(req.body.orderId, req.body.mobileNumber);
  res.json(
    new ApiResponse({
      success: true,
      message: "JazzCash payment initiated",
      data: result
    })
  );
}

export async function jazzCashCallbackController(req: Request, res: Response) {
  const result = await verifyJazzCashCallback(req.body);
  res.json(
    new ApiResponse({
      success: true,
      message: result.success ? "Payment verified" : "Payment failed",
      data: result
    })
  );
}
