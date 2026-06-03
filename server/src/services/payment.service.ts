import crypto from "node:crypto";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { stripe } from "../config/stripe.js";
import { HttpError } from "../utils/httpError.js";
import { sendOrderConfirmation } from "./email.service.js";

export async function createStripePaymentIntent(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true }
  });

  if (!order) {
    throw new HttpError("Order not found", 404);
  }

  if (order.paymentMethod !== "STRIPE") {
    throw new HttpError("Order is not configured for card payment", 400);
  }

  const existingPayment = order.payments.find((payment) => payment.gatewayPaymentId);
  if (existingPayment?.gatewayPaymentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(existingPayment.gatewayPaymentId);
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(Number(order.total) * 100),
    currency: "pkr",
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber
    }
  });

  await prisma.payment.updateMany({
    where: { orderId: order.id },
    data: {
      gatewayPaymentId: paymentIntent.id,
      metadata: { paymentIntentId: paymentIntent.id }
    }
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  };
}

export async function handleStripeWebhook(rawBody: Buffer, signature: string | undefined) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new HttpError("Stripe webhook is not configured", 503);
  }

  if (!signature) {
    throw new HttpError("Missing Stripe signature", 400);
  }

  const event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) {
      return { received: true };
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "CONFIRMED",
          paymentStatus: "PAID"
        }
      });

      await tx.payment.updateMany({
        where: { orderId },
        data: { status: "PAID" }
      });
    });

    await sendOrderConfirmation(orderId);
  }

  return { received: true };
}

function buildJazzCashHash(payload: Record<string, string>, integritySalt: string) {
  const sortedValues = Object.keys(payload)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => payload[key])
    .join("&");

  return crypto
    .createHmac("sha256", integritySalt)
    .update(sortedValues)
    .digest("hex");
}

export async function initiateJazzCashPayment(orderId: string, mobileNumber: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new HttpError("Order not found", 404);
  }

  if (!env.JAZZCASH_MERCHANT_ID || !env.JAZZCASH_PASSWORD || !env.JAZZCASH_INTEGRITY_SALT) {
    throw new HttpError("JazzCash is not configured for this environment", 503);
  }

  const payload = {
    pp_Amount: String(Math.round(Number(order.total) * 100)),
    pp_BillReference: order.orderNumber,
    pp_Description: `Bukhari Perfumes order ${order.orderNumber}`,
    pp_MerchantID: env.JAZZCASH_MERCHANT_ID,
    pp_MobileNumber: mobileNumber,
    pp_Password: env.JAZZCASH_PASSWORD,
    pp_ReturnURL: `${env.FRONTEND_URL}/orders/${order.id}`,
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14),
    pp_TxnRefNo: order.orderNumber,
    pp_TxnType: "MWALLET",
    pp_Version: "1.1"
  };

  const pp_SecureHash = buildJazzCashHash(payload, env.JAZZCASH_INTEGRITY_SALT);

  return {
    redirectUrl: env.JAZZCASH_POST_URL ?? "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform",
    formFields: {
      ...payload,
      pp_SecureHash
    }
  };
}

export async function verifyJazzCashCallback(params: Record<string, string>) {
  if (!env.JAZZCASH_INTEGRITY_SALT) {
    throw new HttpError("JazzCash is not configured", 503);
  }

  const receivedHash = params.pp_SecureHash;
  const payload = { ...params };
  delete payload.pp_SecureHash;

  const expectedHash = buildJazzCashHash(payload, env.JAZZCASH_INTEGRITY_SALT);
  if (receivedHash !== expectedHash) {
    throw new HttpError("Invalid JazzCash callback signature", 400);
  }

  const orderNumber = params.pp_TxnRefNo;
  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) {
    throw new HttpError("Order not found", 404);
  }

  const isSuccess = params.pp_ResponseCode === "000";

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: isSuccess ? "CONFIRMED" : order.status,
        paymentStatus: isSuccess ? "PAID" : "FAILED"
      }
    });

    await tx.payment.updateMany({
      where: { orderId: order.id },
      data: { status: isSuccess ? "PAID" : "FAILED", metadata: params }
    });
  });

  if (isSuccess) {
    await sendOrderConfirmation(order.id);
  }

  return { success: isSuccess, orderId: order.id };
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Order placed",
  CONFIRMED: "Order confirmed",
  PROCESSING: "Being prepared",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded"
};
