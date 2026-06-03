import { z } from "zod";

export const stripeIntentSchema = z.object({
  orderId: z.string().min(1)
});

export const jazzCashInitiateSchema = z.object({
  orderId: z.string().min(1),
  mobileNumber: z.string().min(10).max(15)
});

export const jazzCashCallbackSchema = z.record(z.string());
