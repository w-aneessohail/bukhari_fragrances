import type { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface UploadedFileResult {
      originalName: string;
      url: string;
      publicId: string;
    }

    interface User {
      userId: string;
      email: string;
      role: UserRole;
    }

    interface Request {
      uploadedFiles?: UploadedFileResult[];
    }
  }
}

export {};
