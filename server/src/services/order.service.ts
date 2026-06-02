import { PaymentGateway, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { stripe } from "../config/stripe.js";
import { HttpError } from "../utils/httpError.js";
import { decimalToNumber } from "../utils/product.utils.js";

const FREE_SHIPPING_MIN = 10_000;
const SHIPPING_FLAT = 500;

const cartInclude = {
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
  paymentMethod: "COD" | "STRIPE";
  address: {
    label: string;
    street: string;
    area: string;
    city: string;
    province: string;
    postalCode: string;
  };
  saveAddress?: boolean;
  notes?: string;
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
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping,
    discount: 0,
    total: Number(total.toFixed(2)),
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
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;
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
        discount: new Prisma.Decimal(0),
        shipping: new Prisma.Decimal(shipping),
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

    return createdOrder;
  });

  let clientSecret: string | null = null;

  if (input.paymentMethod === "STRIPE") {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: "pkr",
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber
        }
      });

      clientSecret = paymentIntent.client_secret;

      await prisma.payment.updateMany({
        where: { orderId: order.id },
        data: {
          gatewayPaymentId: paymentIntent.id,
          metadata: { paymentIntentId: paymentIntent.id }
        }
      });
    } catch {
      throw new HttpError("Card payment is unavailable. Please choose cash on delivery.", 503);
    }
  }

  return {
    order: mapOrder(order),
    clientSecret
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
