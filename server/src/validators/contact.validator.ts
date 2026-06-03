import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  subject: z.string().min(2).max(120),
  message: z.string().min(10).max(2000)
});

export const newsletterSubscribeSchema = z.object({
  email: z.string().email()
});
