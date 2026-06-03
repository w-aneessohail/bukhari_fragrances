import type { Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";
import {
  createScentDiaryEntry,
  deleteScentDiaryEntry,
  listScentDiaryEntries,
  updateScentDiaryEntry
} from "../services/scentDiary.service.js";
import { HttpError } from "../utils/httpError.js";

export async function listEntries(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const entries = await listScentDiaryEntries(userId);
  res.json(
    new ApiResponse({
      success: true,
      message: "Scent diary entries retrieved",
      data: entries
    })
  );
}

export async function createEntry(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const entry = await createScentDiaryEntry(userId, req.body);
  res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Diary entry created",
      data: entry
    })
  );
}

export async function updateEntry(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  const entry = await updateScentDiaryEntry(userId, req.params.id, req.body);
  res.json(
    new ApiResponse({
      success: true,
      message: "Diary entry updated",
      data: entry
    })
  );
}

export async function deleteEntry(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new HttpError("Authentication required", 401);
  }

  await deleteScentDiaryEntry(userId, req.params.id);
  res.json(
    new ApiResponse({
      success: true,
      message: "Diary entry deleted"
    })
  );
}
