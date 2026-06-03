import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import {
  calculateCartTotals,
  validateDiscountForCart
} from "../utils/cartTotals.utils.js";
import { decimalToNumber } from "../utils/product.utils.js";

const emptyCartResponse = {
  id: null,
  items: [],
  subtotal: 0,
  itemCount: 0,
  discount: 0,
  shipping: 0,
  total: 0,
  discountCode: null as string | null
};

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

type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

function mapCart(cart: CartWithItems) {
  const items = cart.items.map((item) => {
    const unitPrice = decimalToNumber(item.price) ?? 0;
    const mainImage =
      item.product.images.find((image) => image.isMain) ?? item.product.images[0] ?? null;

    return {
      id: item.id,
      productId: item.productId,
      sizeId: item.sizeId,
      quantity: item.quantity,
      price: unitPrice,
      lineTotal: Number((unitPrice * item.quantity).toFixed(2)),
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        stock: item.product.stock,
        mainImage: mainImage?.url ?? null
      },
      size: item.size
        ? {
            id: item.size.id,
            sizeMl: item.size.sizeMl,
            stock: item.size.stock
          }
        : null
    };
  });

  const subtotal = Number(items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totals = calculateCartTotals(subtotal, cart.discount);

  return {
    id: cart.id,
    items,
    subtotal,
    itemCount,
    discount: totals.discountAmount,
    shipping: totals.shipping,
    total: totals.total,
    discountCode: totals.discountCode
  };
}

async function resolveUnitPrice(productId: string, sizeId?: string | null) {
  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
    include: { sizes: true }
  });

  if (!product) {
    throw new HttpError("Product not found", 404);
  }

  if (product.sizes.length > 0) {
    if (!sizeId) {
      throw new HttpError("Please select a size", 400);
    }

    const size = product.sizes.find((entry) => entry.id === sizeId);
    if (!size) {
      throw new HttpError("Invalid size for this product", 400);
    }

    if (size.stock < 1) {
      throw new HttpError("Selected size is out of stock", 400);
    }

    return {
      product,
      size,
      unitPrice: size.price,
      availableStock: size.stock
    };
  }

  if (sizeId) {
    throw new HttpError("This product does not use sizes", 400);
  }

  if (product.stock < 1) {
    throw new HttpError("Product is out of stock", 400);
  }

  const unitPrice =
    product.salePrice && product.salePrice.lessThan(product.price) ? product.salePrice : product.price;

  return {
    product,
    size: null,
    unitPrice,
    availableStock: product.stock
  };
}

export async function mergeGuestCartIntoUser(userId: string, sessionId: string) {
  const guestCart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true }
  });

  if (!guestCart || guestCart.items.length === 0) {
    return;
  }

  let userCart = await prisma.cart.findUnique({ where: { userId } });
  if (!userCart) {
    userCart = await prisma.cart.create({ data: { userId } });
  }

  for (const item of guestCart.items) {
    await upsertCartItem(userCart.id, item.productId, item.sizeId, item.quantity, false);
  }

  await prisma.cart.delete({ where: { id: guestCart.id } });
}

async function upsertCartItem(
  cartId: string,
  productId: string,
  sizeId: string | null | undefined,
  quantity: number,
  validateStock = true
) {
  const { unitPrice, availableStock } = await resolveUnitPrice(productId, sizeId ?? null);

  const existing = await prisma.cartItem.findFirst({
    where: {
      cartId,
      productId,
      sizeId: sizeId ?? null
    }
  });

  const nextQuantity = (existing?.quantity ?? 0) + quantity;

  if (validateStock && nextQuantity > availableStock) {
    throw new HttpError(`Only ${availableStock} available in stock`, 400);
  }

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity: validateStock ? Math.min(nextQuantity, availableStock) : nextQuantity,
        price: unitPrice
      }
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId,
      productId,
      sizeId: sizeId ?? null,
      quantity: validateStock ? Math.min(quantity, availableStock) : quantity,
      price: unitPrice
    }
  });
}

export async function getOrCreateCartForRequest(userId?: string, sessionId?: string) {
  if (userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: cartInclude
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: cartInclude
      });
    }

    if (sessionId) {
      await mergeGuestCartIntoUser(userId, sessionId);
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: cartInclude
      });
    }

    return { cart: mapCart(cart!), sessionId: undefined };
  }

  const guestSessionId = sessionId ?? randomUUID();

  let cart = await prisma.cart.findUnique({
    where: { sessionId: guestSessionId },
    include: cartInclude
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId: guestSessionId },
      include: cartInclude
    });
  }

  return { cart: mapCart(cart), sessionId: guestSessionId };
}

export async function getCart(userId?: string, sessionId?: string) {
  if (userId) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: cartInclude
    });

    if (!cart) {
      return { id: null, items: [], subtotal: 0, itemCount: 0 };
    }

    return mapCart(cart);
  }

  if (!sessionId) {
    return { id: null, items: [], subtotal: 0, itemCount: 0 };
  }

  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: cartInclude
  });

  if (!cart) {
    return { id: null, items: [], subtotal: 0, itemCount: 0 };
  }

  return mapCart(cart);
}

export async function addCartItem(
  input: { productId: string; sizeId?: string | null; quantity: number },
  userId?: string,
  sessionId?: string
) {
  if (userId) {
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    if (sessionId) {
      await mergeGuestCartIntoUser(userId, sessionId);
      cart = await prisma.cart.findUnique({ where: { userId } });
    }

    await upsertCartItem(cart!.id, input.productId, input.sizeId, input.quantity);
    return getCart(userId);
  }

  const { cart: guestCart, sessionId: guestSessionId } = await getOrCreateCartForRequest(
    undefined,
    sessionId
  );

  if (!guestCart.id) {
    throw new HttpError("Unable to create cart", 500);
  }

  await upsertCartItem(guestCart.id, input.productId, input.sizeId, input.quantity);

  const updated = await getCart(undefined, guestSessionId);
  return { cart: updated, sessionId: guestSessionId };
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number,
  userId?: string,
  sessionId?: string
) {
  const cart = await findCartForOwner(userId, sessionId);
  if (!cart) {
    throw new HttpError("Cart not found", 404);
  }

  const item = cart.items.find((entry) => entry.id === itemId);

  if (!item) {
    throw new HttpError("Cart item not found", 404);
  }

  const { availableStock } = await resolveUnitPrice(item.productId, item.sizeId);
  if (quantity > availableStock) {
    throw new HttpError(`Only ${availableStock} available in stock`, 400);
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity }
  });

  return getCart(userId, sessionId);
}

export async function removeCartItem(itemId: string, userId?: string, sessionId?: string) {
  const cart = await findCartForOwner(userId, sessionId);
  if (!cart) {
    throw new HttpError("Cart not found", 404);
  }

  const item = cart.items.find((entry) => entry.id === itemId);

  if (!item) {
    throw new HttpError("Cart item not found", 404);
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getCart(userId, sessionId);
}

export async function clearCart(userId?: string, sessionId?: string) {
  const cart = await findCartForOwner(userId, sessionId, false);
  if (!cart) {
    return getCart(userId, sessionId);
  }

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return getCart(userId, sessionId);
}

async function findCartForOwner(userId?: string, sessionId?: string, required = true) {
  if (userId) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: cartInclude
    });

    if (!cart && required) {
      throw new HttpError("Cart not found", 404);
    }

    return cart;
  }

  if (!sessionId) {
    if (required) {
      throw new HttpError("Cart not found", 404);
    }
    return null;
  }

  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: cartInclude
  });

  if (!cart && required) {
    throw new HttpError("Cart not found", 404);
  }

  return cart;
}

export async function applyCartDiscount(code: string, userId?: string, sessionId?: string) {
  const cart = await findCartForOwner(userId, sessionId);

  if (!cart || cart.items.length === 0) {
    throw new HttpError("Your cart is empty", 400);
  }

  const normalizedCode = code.trim().toUpperCase();
  const discount = await prisma.discount.findUnique({
    where: { code: normalizedCode }
  });

  if (!discount) {
    throw new HttpError("Invalid discount code", 400);
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  validateDiscountForCart(discount, subtotal);

  await prisma.cart.update({
    where: { id: cart.id },
    data: { discountId: discount.id }
  });

  return getCart(userId, sessionId);
}

export async function removeCartDiscount(userId?: string, sessionId?: string) {
  const cart = await findCartForOwner(userId, sessionId, false);

  if (!cart) {
    return getCart(userId, sessionId);
  }

  if (cart.discountId) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: { discountId: null }
    });
  }

  return getCart(userId, sessionId);
}
