import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Reuse the client across warm Lambda invocations in both dev AND production.
// Without this, production creates a new PrismaClient (and reconnects to Neon)
// on every request even when the Lambda container is already warm.
globalForPrisma.prisma = prisma;
