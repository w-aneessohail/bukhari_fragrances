import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["warn", "error"]
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const DB_CONNECT_TIMEOUT_MS = 10_000;

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function connectDatabase() {
  const connectTask = async () => {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
  };

  const timeoutTask = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          `Database connection timed out after ${DB_CONNECT_TIMEOUT_MS}ms. Is PostgreSQL running?`
        )
      );
    }, DB_CONNECT_TIMEOUT_MS);
  });

  try {
    await Promise.race([connectTask(), timeoutTask]);
    console.log("Database connected successfully.");
  } catch (error) {
    console.error(
      "Database connection failed. Start PostgreSQL and verify DATABASE_URL in .env."
    );
    throw error;
  }
}
