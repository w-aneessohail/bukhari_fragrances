import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import { changePassword, getCurrentUser } from "../services/auth.service.js";
import {
  createAddress,
  deleteAddress,
  listAddresses,
  updateAddress
} from "../services/address.service.js";
import { HttpError } from "../utils/httpError.js";

export async function getMe(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const user = await getCurrentUser(userId);
  res.json(
    new ApiResponse({
      success: true,
      message: "Profile retrieved",
      data: user
    })
  );
}

export async function changePasswordController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  await changePassword(userId, req.body.currentPassword, req.body.newPassword);
  res.json(
    new ApiResponse({
      success: true,
      message: "Password updated successfully"
    })
  );
}

export async function listAddressesController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const addresses = await listAddresses(userId);
  res.json(
    new ApiResponse({
      success: true,
      message: "Addresses retrieved",
      data: addresses
    })
  );
}

export async function createAddressController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const address = await createAddress(userId, req.body);
  res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Address created",
      data: address
    })
  );
}

export async function updateAddressController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const address = await updateAddress(userId, req.params.id, req.body);
  res.json(
    new ApiResponse({
      success: true,
      message: "Address updated",
      data: address
    })
  );
}

export async function deleteAddressController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  await deleteAddress(userId, req.params.id);
  res.json(
    new ApiResponse({
      success: true,
      message: "Address deleted"
    })
  );
}
