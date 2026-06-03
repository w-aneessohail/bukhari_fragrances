import { prisma } from "../config/database.js";
import { defaultFromEmail, emailTransporter } from "../config/email.js";
import { env } from "../config/env.js";
import { decimalToNumber } from "../utils/product.utils.js";

type OrderEmailData = {
  id: string;
  orderNumber: string;
  total: { toNumber?: () => number } | number | string;
  status: string;
  user: { name: string; email: string };
  items: {
    name: string;
    quantity: number;
    price: { toNumber?: () => number } | number | string;
  }[];
};

function formatMoney(value: OrderEmailData["total"]) {
  const amount =
    typeof value === "object" && value !== null && "toNumber" in value && value.toNumber
      ? value.toNumber()
      : Number(value);
  return `Rs. ${amount.toLocaleString()}`;
}

function buildItemsTable(order: OrderEmailData) {
  const rows = order.items
    .map((item) => {
      const price =
        typeof item.price === "object" && item.price !== null && "toNumber" in item.price
          ? item.price.toNumber?.()
          : Number(item.price);
      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">Rs. ${Number(price).toLocaleString()}</td>
      </tr>`;
    })
    .join("");

  return `<table style="width:100%;border-collapse:collapse;margin-top:16px;">
    <thead>
      <tr>
        <th align="left" style="padding:8px;border-bottom:2px solid #B8860B;">Item</th>
        <th align="left" style="padding:8px;border-bottom:2px solid #B8860B;">Qty</th>
        <th align="left" style="padding:8px;border-bottom:2px solid #B8860B;">Price</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  if (env.NODE_ENV === "development") {
    console.info("[email]", subject, "→", to);
    return;
  }

  await emailTransporter.sendMail({
    from: defaultFromEmail,
    to,
    subject,
    html
  });
}

export async function sendOrderConfirmation(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true } },
      items: true
    }
  });

  if (!order) return;

  const trackUrl = `${env.FRONTEND_URL}/orders/${order.id}`;
  const html = `
    <div style="font-family:Georgia,serif;color:#1A1A2E;max-width:560px;">
      <h1 style="color:#B8860B;">Thank you for your order</h1>
      <p>Hi ${order.user.name},</p>
      <p>Your Bukhari Perfumes order <strong>${order.orderNumber}</strong> has been received.</p>
      ${buildItemsTable(order)}
      <p style="margin-top:16px;font-size:18px;"><strong>Total: ${formatMoney(order.total)}</strong></p>
      <p><a href="${trackUrl}" style="color:#B8860B;">Track your order</a></p>
    </div>
  `;

  await sendEmail(order.user.email, `Order confirmed — ${order.orderNumber}`, html);
}

export async function sendShippingUpdate(orderId: string, statusLabel: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true } },
      items: true
    }
  });

  if (!order) return;

  const trackUrl = `${env.FRONTEND_URL}/orders/${order.id}`;
  const html = `
    <div style="font-family:Georgia,serif;color:#1A1A2E;max-width:560px;">
      <h1 style="color:#B8860B;">Order update</h1>
      <p>Hi ${order.user.name},</p>
      <p>Your order <strong>${order.orderNumber}</strong> is now: <strong>${statusLabel}</strong>.</p>
      <p><a href="${trackUrl}" style="color:#B8860B;">View order details</a></p>
    </div>
  `;

  await sendEmail(order.user.email, `Order update — ${order.orderNumber}`, html);
}

export async function sendNewsletterWelcome(email: string) {
  const html = `
    <div style="font-family:Georgia,serif;color:#1A1A2E;max-width:560px;">
      <h1 style="color:#B8860B;">Welcome to Bukhari Perfumes</h1>
      <p>Thank you for subscribing. We will share new arrivals, offers, and scent guides with you.</p>
    </div>
  `;

  await sendEmail(email, "Welcome to Bukhari Perfumes", html);
}
