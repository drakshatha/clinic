/**
 * prisma/seed.ts — run once after migrate to create default staff accounts.
 * Usage: npx prisma db seed
 *
 * Passwords come from env vars so they're never in source code:
 *   SEED_DOCTOR_PASSWORD   (default: doctor2026)
 *   SEED_ASSISTANT_PASSWORD (default: assist2026)
 */
import { PrismaClient } from "../src/generated/prisma";
import crypto from "crypto";

const prisma = new PrismaClient();

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function main() {
  const doctorPass = process.env.SEED_DOCTOR_PASSWORD ?? "doctor2026";
  const assistPass = process.env.SEED_ASSISTANT_PASSWORD ?? "assist2026";

  await prisma.staffUser.upsert({
    where: { username: "doctor" },
    update: {},
    create: {
      id: "staff_doctor",
      name: "Dr. Akshatha V",
      username: "doctor",
      passwordHash: hash(doctorPass),
      role: "doctor",
    },
  });

  await prisma.staffUser.upsert({
    where: { username: "assistant" },
    update: {},
    create: {
      id: "staff_assistant",
      name: "Clinic Assistant",
      username: "assistant",
      passwordHash: hash(assistPass),
      role: "assistant",
    },
  });

  console.log("✅ Staff seeded — doctor + assistant accounts ready.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
