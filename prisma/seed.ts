/**
 * prisma/seed.ts — run once after migrate to create default staff accounts.
 * Usage: npx prisma db seed
 */
import { PrismaClient } from "../src/generated/prisma";
import crypto from "crypto";
import { OWNER_PERMISSIONS, DEFAULT_PERMISSIONS } from "../src/lib/permissions";

const prisma = new PrismaClient();

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function main() {
  const doctorPass = process.env.SEED_DOCTOR_PASSWORD ?? "doctor2026";
  const assistPass = process.env.SEED_ASSISTANT_PASSWORD ?? "assist2026";

  await prisma.staffUser.upsert({
    where: { username: "doctor" },
    update: {
      permissions: JSON.stringify(OWNER_PERMISSIONS),
      isOwner: true,
    },
    create: {
      id: "staff_doctor",
      name: "Dr. Akshatha V",
      username: "doctor",
      passwordHash: hash(doctorPass),
      role: "Doctor",
      permissions: JSON.stringify(OWNER_PERMISSIONS),
      isOwner: true,
    },
  });

  await prisma.staffUser.upsert({
    where: { username: "assistant" },
    update: {
      permissions: JSON.stringify(DEFAULT_PERMISSIONS),
    },
    create: {
      id: "staff_assistant",
      name: "Clinic Assistant",
      username: "assistant",
      passwordHash: hash(assistPass),
      role: "Assistant",
      permissions: JSON.stringify(DEFAULT_PERMISSIONS),
    },
  });

  console.log("✅ Staff seeded — doctor (owner, all permissions) + assistant (default permissions).");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
