import { PaymentGateway, Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { calculateCartTotals, validateDiscountForCart } from "../utils/cartTotals.utils.js";
import { COD_FEE } from "../utils/loyalty.utils.js";
import { HttpError } from "../utils/httpError.js";
import { decimalToNumber } from "../utils/product.utils.js";
import { sendOrderConfirmation } from "./email.service.js";
import { previewLoyaltyRedemption, redeemLoyaltyPoints, restoreLoyaltyOnCancel } from "./loyalty.service.js";
import { createStripePaymentIntent, initiateJazzCashPayment } from "./payment.service.js";

const cartInclude = {
  discount: true,
  items: {
    orderBy: { createdAt: "asc" as const },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" as const } }
        }
      },
      size: true
    }
  }
};

type CreateOrderInput = {
  paymentMethod: "COD" | "STRIPE" | "JAZZCASH";
  address: {
    label: string;
    street: string;
    area: string;
    city: string;
    province: string;
    postalCode: string;
    phone?: string;
  };
  saveAddress?: boolean;
  notes?: string;
  redeemLoyaltyPoints?: boolean;
  jazzCashMobile?: string;
};

function generateOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BUK-${date}-${suffix}`;
}

function formatShippingNotes(input: CreateOrderInput) {
  const { address, notes } = input;
  const lines = [
    `Ship to: ${address.label}`,
    `${address.street}, ${address.area}`,
    `${address.city}, ${address.province} ${address.postalCode}`
  ];

  if (notes?.trim()) {
    lines.push(`Notes: ${notes.trim()}`);
  }

  return lines.join("\n");
}

function mapOrder(order: {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: Prisma.Decimal;
  discount: Prisma.Decimal;
  shipping: Prisma.Decimal;
  total: Prisma.Decimal;
  paymentMethod: string;
  paymentStatus: string;
  notes: string | null;
  createdAt: Date;
  items: {
    id: string;
    name: string;
    price: Prisma.Decimal;
    quantity: number;
    sizeLabel: string | null;
    image: string | null;
    product: { slug: string };
  }[];
}) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: decimalToNumber(order.subtotal),
    discount: decimalToNumber(order.discount),
    shipping: decimalToNumber(order.shipping),
    total: decimalToNumber(order.total),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    notes: order.notes,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.product.slug,
      price: decimalToNumber(item.price),
      quantity: item.quantity,
      sizeLabel: item.sizeLabel,
      image: item.image,
      lineTotal: Number((Number(item.price) * item.quantity).toFixed(2))
    }))
  };
}

export async function getCheckoutSummary(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: cartInclude
  });

  if (!cart || cart.items.length === 0) {
    throw new HttpError("Your cart is empty", 400);
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  let activeDiscount = cart.discount;
  if (activeDiscount) {
    try {
      validateDiscountForCart(activeDiscount, subtotal);
    } catch {
      await prisma.cart.update({
        where: { id: cart.id },
        data: { discountId: null }
      });
      activeDiscount = null;
    }
  }

  const { discountAmount, shipping, total } = calculateCartTotals(subtotal, activeDiscount);
  const loyaltyPreview = await previewLoyaltyRedemption(userId, Math.max(0, subtotal - discountAmount + shipping));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping,
    discount: discountAmount,
    discountCode: activeDiscount?.code ?? null,
    codFee: COD_FEE,
    loyaltyBalance: loyaltyPreview.balance,
    loyaltyDiscount: loyaltyPreview.discount,
    loyaltyPointsUsed: loyaltyPreview.pointsUsed,
    total,
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
  };
}

export async function createOrderFromCart(userId: string, input: CreateOrderInput) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: cartInclude
  });

  if (!cart || cart.items.length === 0) {
    throw new HttpError("Your cart is empty", 400);
  }

  for (const item of cart.items) {
    if (!item.product.isActive) {
      throw new HttpError(`${item.product.name} is no longer available`, 400);
    }

    if (item.sizeId && item.size) {
      if (item.size.stock < item.quantity) {
        throw new HttpError(`Insufficient stock for ${item.product.name} (${item.size.sizeMl} ml)`, 400);
      }
    } else if (item.product.stock < item.quantity) {
      throw new HttpError(`Insufficient stock for ${item.product.name}`, 400);
    }
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  let activeDiscount = cart.discount;
  if (activeDiscount) {
    try {
      validateDiscountForCart(activeDiscount, subtotal);
    } catch (error) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: { discountId: null }
      });
      throw error;
    }
  }

  const { discountAmount, shipping, total: cartTotal } = calculateCartTotals(subtotal, activeDiscount);
  const preLoyaltyTotal = Math.max(0, cartTotal);
  let loyaltyDiscount = 0;
  let loyaltyPointsUsed = 0;

  if (input.redeemLoyaltyPoints) {
    const redemption = await previewLoyaltyRedemption(userId, preLoyaltyTotal);
    loyaltyDiscount = redemption.discount;
    loyaltyPointsUsed = redemption.pointsUsed;
  }

  const codFee = input.paymentMethod === "COD" ? COD_FEE : 0;
  const total = Number(Math.max(0, preLoyaltyTotal - loyaltyDiscount + codFee).toFixed(2));
  const orderNumber = generateOrderNumber();
  const paymentGateway: PaymentGateway = input.paymentMethod;
  const shippingNotes = formatShippingNotes(input);

  const order = await prisma.$transaction(async (tx) => {
    if (input.saveAddress) {
      const existingDefault = await tx.address.findFirst({
        where: { userId, isDefault: true }
      });

      await tx.address.create({
        data: {
          userId,
          label: input.address.label,
          street: input.address.street,
          area: input.address.area,
          city: input.address.city,
          province: input.address.province,
          postalCode: input.address.postalCode,
          isDefault: !existingDefault
        }
      });
    }

    const createdOrder = await tx.order.create({
      data: {
        userId,
        orderNumber,
        status: input.paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
        subtotal: new Prisma.Decimal(subtotal),
        discount: new Prisma.Decimal(discountAmount + loyaltyDiscount),
        shipping: new Prisma.Decimal(shipping + codFee),
        total: new Prisma.Decimal(total),
        paymentMethod: paymentGateway,
        paymentStatus: input.paymentMethod === "COD" ? "PENDING" : "PENDING",
        notes: shippingNotes,
        items: {
          create: cart.items.map((item) => {
            const mainImage =
              item.product.images.find((image) => image.isMain) ?? item.product.images[0];

            return {
              productId: item.productId,
              name: item.product.name,
              price: item.price,
              quantity: item.quantity,
              sizeLabel: item.size ? `${item.size.sizeMl} ml` : null,
              image: mainImage?.url ?? null
            };
          })
        },
        payments: {
          create: {
            gateway: paymentGateway,
            amount: new Prisma.Decimal(total),
            currency: "PKR",
            status: "PENDING"
          }
        }
      },
      include: {
        items: { include: { product: { select: { slug: true } } } }
      }
    });

    for (const item of cart.items) {
      if (item.sizeId && item.size) {
        await tx.productSize.update({
          where: { id: item.sizeId },
          data: { stock: { decrement: item.quantity } }
        });
      } else {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    if (cart.discountId) {
      await tx.cart.update({
        where: { id: cart.id },
        data: { discountId: null }
      });

      await tx.discount.update({
        where: { id: cart.discountId },
        data: { usedCount: { increment: 1 } }
      });
    }

    return createdOrder;
  });

  if (loyaltyPointsUsed > 0) {
    await redeemLoyaltyPoints(userId, preLoyaltyTotal, order.id);
  }

  let clientSecret: string | null = null;
  let jazzCashRedirect: { redirectUrl: string; formFields: Record<string, string> } | null = null;

  if (input.paymentMethod === "STRIPE") {
    try {
      const payment = await createStripePaymentIntent(order.id);
      clientSecret = payment.clientSecret;
    } catch {
      throw new HttpError("Card payment is unavailable. Please choose cash on delivery.", 503);
    }
  }

  if (input.paymentMethod === "COD") {
    await sendOrderConfirmation(order.id);
  }

  if (input.paymentMethod === "JAZZCASH" && input.jazzCashMobile) {
    try {
      jazzCashRedirect = await initiateJazzCashPayment(order.id, input.jazzCashMobile);
    } catch {
      throw new HttpError("JazzCash payment is unavailable. Please choose cash on delivery.", 503);
    }
  }

  return {
    order: mapOrder(order),
    clientSecret,
    jazzCashRedirect
  };
}

export async function listUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: { include: { product: { select: { slug: true } } } }
    },
    orderBy: { createdAt: "desc" }
  });

  return orders.map(mapOrder);
}

export async function getUserOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: { include: { product: { select: { slug: true } } } }
    }
  });

  if (!order) {
    throw new HttpError("Order not found", 404);
  }

  return mapOrder(order);
}

const TRACKING_STEPS = [
  { status: "PENDING", label: "Order placed", icon: "shopping-bag" },
  { status: "CONFIRMED", label: "Order confirmed", icon: "check" },
  { status: "PROCESSING", label: "Being prepared", icon: "package" },
  { status: "SHIPPED", label: "Shipped", icon: "truck" },
  { status: "OUT_FOR_DELIVERY", label: "Out for delivery", icon: "map-pin" },
  { status: "DELIVERED", label: "Delivered", icon: "home" }
] as const;

const STATUS_ORDER = TRACKING_STEPS.map((step) => step.status);

function buildOrderTimeline(order: { status: string; createdAt: Date; updatedAt: Date }) {
  if (order.status === "CANCELLED" || order.status === "REFUNDED") {
    return [
      {
        status: order.status,
        label: order.status === "CANCELLED" ? "Order cancelled" : "Order refunded",
        icon: "x",
        completed: true,
        active: true,
        timestamp: order.updatedAt.toISOString()
      }
    ];
  }

  const currentIndex = STATUS_ORDER.indexOf(order.status as (typeof STATUS_ORDER)[number]);

  return TRACKING_STEPS.map((step, index) => {
    const completed = currentIndex >= index && currentIndex !== -1;
    const active = order.status === step.status;

    return {
      status: step.status,
      label: step.label,
      icon: step.icon,
      completed,
      active,
      timestamp: completed ? (index === 0 ? order.createdAt.toISOString() : order.updatedAt.toISOString()) : null
    };
  });
}

export async function getOrderTracking(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: { include: { product: { select: { slug: true } } } }
    }
  });

  if (!order) {
    throw new HttpError("Order not found", 404);
  }

  return {
    order: mapOrder(order),
    timeline: buildOrderTimeline(order),
    canCancel: order.status === "PENDING" || order.status === "CONFIRMED"
  };
}

export async function cancelUserOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true }
  });

  if (!order) {
    throw new HttpError("Order not found", 404);
  }

  if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
    throw new HttpError("This order can no longer be cancelled", 400);
  }

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      if (item.sizeLabel) {
        const sizeMl = Number.parseInt(item.sizeLabel, 10);
        if (!Number.isNaN(sizeMl)) {
          const size = await tx.productSize.findFirst({
            where: { productId: item.productId, sizeMl }
          });
          if (size) {
            await tx.productSize.update({
              where: { id: size.id },
              data: { stock: { increment: item.quantity } }
            });
            continue;
          }
        }
      }

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } }
      });
    }

    await tx.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" }
    });
  });

  await restoreLoyaltyOnCancel(orderId);

  return getOrderTracking(userId, orderId);
}
