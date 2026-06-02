import { z } from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(120),
  newPassword: z.string().min(8).max(120)
});

export const addressSchema = z.object({
  label: z.string().min(1).max(60),
  street: z.string().min(1).max(200),
  area: z.string().min(1).max(120),
  city: z.string().min(1).max(80),
  province: z.string().min(1).max(80),
  postalCode: z.string().min(1).max(20),
  isDefault: z.boolean().optional()
});

export const addressIdParamsSchema = z.object({
  id: z.string().min(1)
});
