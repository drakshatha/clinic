/**
 * prisma.ts — Prisma client wired to Neon's serverless HTTP driver.
 *
 * Why HTTP instead of TCP?
 * In serverless environments (Vercel), each function invocation previously
 * needed a fresh TCP + SSL handshake to PostgreSQL even through PgBouncer.
 * PrismaNeonHttp sends queries as plain HTTP/1.1 requests that reuse
 * Vercel's persistent keep-alive connections — zero connection overhead and
 * no cold-start penalty even when the function hasn't run in hours.
 */
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma";

function makePrismaClient() {
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {
    arrayMode: false,
    fullResults: false,
  });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Reuse across warm Lambda invocations — avoids recreating the adapter
// on every request when the function container is still alive.
export const prisma = globalForPrisma.prisma ?? makePrismaClient();
globalForPrisma.prisma = prisma;
