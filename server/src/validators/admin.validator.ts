import { z } from "zod";

const orderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED"
]);

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum
});

export const orderIdParamsSchema = z.object({
  id: z.string().min(1)
});

export const adminListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: orderStatusEnum.optional(),
  search: z.string().optional()
});
