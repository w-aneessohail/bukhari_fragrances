import { z } from "zod";

const addressSchema = z.object({
  label: z.string().min(1).max(60),
  street: z.string().min(1).max(200),
  area: z.string().min(1).max(120),
  city: z.string().min(1).max(80),
  province: z.string().min(1).max(80),
  postalCode: z.string().min(1).max(20)
});

export const createOrderSchema = z.object({
  paymentMethod: z.enum(["COD", "STRIPE"]),
  address: addressSchema,
  saveAddress: z.boolean().optional(),
  notes: z.string().max(500).optional()
});

export const orderIdParamsSchema = z.object({
  id: z.string().min(1)
});
