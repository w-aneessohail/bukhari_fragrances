import type { Discount } from "@prisma/client";
import { HttpError } from "./httpError.js";

export const FREE_SHIPPING_MIN = 10_000;
export const SHIPPING_FLAT = 500;

export function validateDiscountForCart(discount: Discount, subtotal: number) {
  if (!discount.isActive) {
    throw new HttpError("This discount code is not active", 400);
  }

  if (discount.expiresAt && discount.expiresAt < new Date()) {
    throw new HttpError("This discount code has expired", 400);
  }

  if (discount.maxUses != null && discount.usedCount >= discount.maxUses) {
    throw new HttpError("This discount code has reached its usage limit", 400);
  }

  const minOrder = discount.minOrder ? Number(discount.minOrder) : 0;
  if (subtotal < minOrder) {
    throw new HttpError(`Minimum order of Rs. ${minOrder.toLocaleString()} required for this code`, 400);
  }
}

export function calculateCartTotals(
  subtotal: number,
  discount?: Pick<Discount, "type" | "value" | "code"> | null
) {
  let discountAmount = 0;
  let shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FLAT;
  let discountCode: string | null = null;

  if (discount) {
    discountCode = discount.code;

    switch (discount.type) {
      case "PERCENTAGE":
        discountAmount = Number(((subtotal * Number(discount.value)) / 100).toFixed(2));
        break;
      case "FIXED_AMOUNT":
        discountAmount = Math.min(subtotal, Number(discount.value));
        break;
      case "FREE_SHIPPING":
        shipping = 0;
        break;
      default:
        break;
    }
  }

  const discountedSubtotal = subtotal - discountAmount;
  if (discount?.type !== "FREE_SHIPPING" && discountedSubtotal >= FREE_SHIPPING_MIN) {
    shipping = 0;
  }

  const total = Number(Math.max(0, discountedSubtotal + shipping).toFixed(2));

  return {
    discountAmount,
    shipping,
    total,
    discountCode
  };
}
