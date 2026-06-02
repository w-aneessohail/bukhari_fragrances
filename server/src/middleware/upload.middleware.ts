import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";
import { HttpError } from "../utils/httpError.js";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return callback(new HttpError("Only JPEG, PNG, and WebP images are allowed", 400));
    }

    callback(null, true);
  }
});

function uploadBufferToCloudinary(buffer: Buffer, folder: string) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error("Cloudinary upload failed"));
        return;
      }

      resolve(result);
    });

    stream.end(buffer);
  });
}

async function handleUploadedFiles(req: Request, folder: string) {
  const files: Express.Multer.File[] = [];

  if (req.file) {
    files.push(req.file);
  }

  if (Array.isArray(req.files)) {
    files.push(...req.files);
  }

  if (!files.length) {
    throw new HttpError("No files uploaded", 400);
  }

  const uploads = await Promise.all(
    files.map(async (file) => {
      const result = await uploadBufferToCloudinary(file.buffer, folder);
      return {
        originalName: file.originalname,
        url: result.secure_url,
        publicId: result.public_id
      };
    })
  );

  req.uploadedFiles = uploads;
}

export function uploadSingle(folder: string) {
  return [
    upload.single("image"),
    async (req: Request, _res: Response, next: NextFunction) => {
      try {
        if (!req.file) {
          throw new HttpError("Image file is required", 400);
        }

        await handleUploadedFiles(req, folder);
        next();
      } catch (error) {
        next(error);
      }
    }
  ];
}

export function uploadMultiple(folder: string, max = 10) {
  return [
    upload.array("images", max),
    async (req: Request, _res: Response, next: NextFunction) => {
      try {
        await handleUploadedFiles(req, folder);
        next();
      } catch (error) {
        next(error);
      }
    }
  ];
}

export function uploadMultipleDynamic(resolveFolder: (req: Request) => string, max = 10) {
  return [
    upload.array("images", max),
    async (req: Request, _res: Response, next: NextFunction) => {
      try {
        await handleUploadedFiles(req, resolveFolder(req));
        next();
      } catch (error) {
        next(error);
      }
    }
  ];
}
