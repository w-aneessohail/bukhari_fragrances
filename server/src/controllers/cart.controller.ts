import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import {
  addCartItem,
  applyCartDiscount,
  clearCart,
  getCart,
  getOrCreateCartForRequest,
  removeCartDiscount,
  removeCartItem,
  updateCartItemQuantity
} from "../services/cart.service.js";

const CART_SESSION_COOKIE = "cart_session";
const CART_SESSION_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

function readSessionId(req: Request) {
  const value = req.cookies?.[CART_SESSION_COOKIE];
  return typeof value === "string" ? value : undefined;
}

function setSessionCookie(res: Response, sessionId: string) {
  const secure = process.env.NODE_ENV === "production";

  res.cookie(CART_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "strict",
    secure,
    maxAge: CART_SESSION_MAX_AGE
  });
}

function clearSessionCookie(res: Response) {
  res.clearCookie(CART_SESSION_COOKIE);
}

export async function getCartController(req: Request, res: Response) {
  const userId = req.user?.userId;
  const sessionId = readSessionId(req);

  if (userId && sessionId) {
    const { cart } = await getOrCreateCartForRequest(userId, sessionId);
    clearSessionCookie(res);
    return res.json(
      new ApiResponse({
        success: true,
        message: "Cart retrieved",
        data: cart
      })
    );
  }

  if (userId) {
    const cart = await getCart(userId);
    return res.json(
      new ApiResponse({
        success: true,
        message: "Cart retrieved",
        data: cart
      })
    );
  }

  if (!sessionId) {
    return res.json(
      new ApiResponse({
        success: true,
        message: "Cart retrieved",
        data: { id: null, items: [], subtotal: 0, itemCount: 0, discount: 0, shipping: 0, total: 0, discountCode: null }
      })
    );
  }

  const cart = await getCart(undefined, sessionId);
  res.json(
    new ApiResponse({
      success: true,
      message: "Cart retrieved",
      data: cart
    })
  );
}

export async function addCartItemController(req: Request, res: Response) {
  const userId = req.user?.userId;
  const sessionId = readSessionId(req);
  const { productId, sizeId, quantity } = req.body;

  if (userId) {
    const cart = await addCartItem({ productId, sizeId, quantity }, userId, sessionId);
    if (sessionId) {
      clearSessionCookie(res);
    }

    return res.status(201).json(
      new ApiResponse({
        success: true,
        message: "Item added to cart",
        data: cart
      })
    );
  }

  const result = await addCartItem({ productId, sizeId, quantity }, undefined, sessionId);
  if ("sessionId" in result && result.sessionId) {
    setSessionCookie(res, result.sessionId);
  }

  res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Item added to cart",
      data: "cart" in result ? result.cart : result
    })
  );
}

export async function updateCartItemController(req: Request, res: Response) {
  const userId = req.user?.userId;
  const sessionId = readSessionId(req);
  const cart = await updateCartItemQuantity(req.params.itemId, req.body.quantity, userId, sessionId);

  res.json(
    new ApiResponse({
      success: true,
      message: "Cart item updated",
      data: cart
    })
  );
}

export async function removeCartItemController(req: Request, res: Response) {
  const userId = req.user?.userId;
  const sessionId = readSessionId(req);
  const cart = await removeCartItem(req.params.itemId, userId, sessionId);

  res.json(
    new ApiResponse({
      success: true,
      message: "Cart item removed",
      data: cart
    })
  );
}

export async function clearCartController(req: Request, res: Response) {
  const userId = req.user?.userId;
  const sessionId = readSessionId(req);
  const cart = await clearCart(userId, sessionId);

  res.json(
    new ApiResponse({
      success: true,
      message: "Cart cleared",
      data: cart
    })
  );
}

export async function applyCartDiscountController(req: Request, res: Response) {
  const userId = req.user?.userId;
  const sessionId = readSessionId(req);
  const cart = await applyCartDiscount(req.body.code, userId, sessionId);

  res.json(
    new ApiResponse({
      success: true,
      message: "Discount applied",
      data: cart
    })
  );
}

export async function removeCartDiscountController(req: Request, res: Response) {
  const userId = req.user?.userId;
  const sessionId = readSessionId(req);
  const cart = await removeCartDiscount(userId, sessionId);

  res.json(
    new ApiResponse({
      success: true,
      message: "Discount removed",
      data: cart
    })
  );
}
