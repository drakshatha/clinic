/**
 * db.ts — thin wrappers over Prisma for backward-compatible use across API routes.
 * All reads/writes now go to Neon PostgreSQL via Prisma instead of the JSON file.
 */
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export type LeadStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show"
  | "followup";

export type VisitType = "consultation" | "treatment" | "followup" | "resolved";
export type PaymentMode = "cash" | "upi" | "card" | "online" | "waived" | "pending";

export type StaffRole = string; // free-text: "Doctor", "Receptionist", etc.

export function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function hashPassword(password: string) {
  return hash(password);
}

export function hashOtp(code: string, phone: string) {
  return hash(`${phone}:${code}`);
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export async function createLead(input: {
  name: string;
  phone: string;
  email?: string;
  treatment?: string;
  message?: string;
  slot_date: string;
  slot_time: string;
  source?: string;
  status?: LeadStatus;
}) {
  const lead = await prisma.lead.create({
    data: {
      name: input.name,
      phone: input.phone,
      email: input.email ?? "",
      treatment: input.treatment ?? "",
      message: input.message ?? "",
      slotDate: input.slot_date,
      slotTime: input.slot_time,
      source: input.source ?? "website",
      status: input.status ?? "pending",
      patientPhone: input.phone,
    },
  });

  // Upsert patient record so history starts from first booking
  await prisma.patient.upsert({
    where: { phone: input.phone },
    update: { name: input.name, email: input.email ?? "", lastSeen: new Date() },
    create: { phone: input.phone, name: input.name, email: input.email ?? "" },
  });

  return leadToLegacy(lead);
}

export async function updateLead(leadId: string, patch: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  if ("status" in patch) data.status = patch.status;
  if ("confirmed_by" in patch) data.confirmedById = patch.confirmed_by;
  if ("confirmed_at" in patch) data.confirmedAt = patch.confirmed_at;
  if ("whatsapp_confirm_sent" in patch) data.whatsappConfirmSent = patch.whatsapp_confirm_sent;

  const lead = await prisma.lead.update({ where: { id: leadId }, data });
  return leadToLegacy(lead);
}

export async function getLead(leadId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  return lead ? leadToLegacy(lead) : null;
}

export async function getAllLeads() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  return leads.map(leadToLegacy);
}

export async function isSlotTaken(date: string, time: string) {
  const booked = await prisma.lead.findFirst({
    where: { slotDate: date, slotTime: time, status: { not: "cancelled" } },
  });
  const blocked = await prisma.blockedSlot.findUnique({
    where: { date_time: { date, time } },
  });
  return !!(booked || blocked);
}

// ─── Blocked Slots ────────────────────────────────────────────────────────────

export async function blockSlot(date: string, time: string, reason = "") {
  return prisma.blockedSlot.upsert({
    where: { date_time: { date, time } },
    update: { reason },
    create: { date, time, reason },
  });
}

export async function unblockSlot(date: string, time: string) {
  return prisma.blockedSlot.deleteMany({ where: { date, time } });
}

export async function getBlockedSlots(date?: string) {
  return prisma.blockedSlot.findMany({ where: date ? { date } : undefined });
}

// ─── OTP ──────────────────────────────────────────────────────────────────────

export async function upsertOtp(phone: string, codeHash: string, expiresAt: Date) {
  return prisma.otpRecord.upsert({
    where: { phone },
    update: { codeHash, expiresAt, attempts: 0, verified: false },
    create: { phone, codeHash, expiresAt, attempts: 0, verified: false },
  });
}

export async function getOtp(phone: string) {
  return prisma.otpRecord.findUnique({ where: { phone } });
}

export async function incrementOtpAttempts(phone: string) {
  return prisma.otpRecord.update({
    where: { phone },
    data: { attempts: { increment: 1 } },
  });
}

export async function markOtpVerified(phone: string) {
  return prisma.otpRecord.update({ where: { phone }, data: { verified: true } });
}

export async function deleteOtp(phone: string) {
  return prisma.otpRecord.deleteMany({ where: { phone } });
}

// ─── Staff / Auth ─────────────────────────────────────────────────────────────

export async function getStaffByUsername(username: string) {
  return prisma.staffUser.findUnique({ where: { username } });
}

export async function createSession(
  token: string,
  userId: string,
  role: string,
  name: string,
  permissions: string,
  expiresAt: Date
) {
  return prisma.session.create({ data: { token, userId, role, name, permissions, expiresAt } });
}

export async function getSession(token: string) {
  return prisma.session.findUnique({ where: { token }, include: { user: true } });
}

export async function deleteSession(token: string) {
  return prisma.session.deleteMany({ where: { token } });
}

// ─── Staff CRUD (doctor only) ─────────────────────────────────────────────────

export async function getAllStaff() {
  return prisma.staffUser.findMany({ orderBy: { createdAt: "asc" } });
}

export async function createStaff(input: {
  name: string;
  username: string;
  password: string;
  role: string;
  permissions: string; // JSON array
}) {
  return prisma.staffUser.create({
    data: {
      name: input.name,
      username: input.username.trim().toLowerCase(),
      passwordHash: hashPassword(input.password),
      role: input.role,
      permissions: input.permissions,
    },
  });
}

export async function updateStaff(
  id: string,
  patch: { name?: string; role?: string; password?: string; permissions?: string }
) {
  const data: Record<string, string> = {};
  if (patch.name) data.name = patch.name;
  if (patch.role) data.role = patch.role;
  if (patch.password) data.passwordHash = hashPassword(patch.password);
  if (patch.permissions !== undefined) data.permissions = patch.permissions;
  return prisma.staffUser.update({ where: { id }, data });
}

export async function deleteStaff(id: string) {
  await prisma.session.deleteMany({ where: { userId: id } });
  return prisma.staffUser.delete({ where: { id } });
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export async function getCalendarSlots(date: string) {
  const leads = await prisma.lead.findMany({
    where: { slotDate: date, status: { not: "cancelled" } },
    select: { id: true, name: true, phone: true, treatment: true, slotTime: true, status: true },
    orderBy: { createdAt: "asc" },
  });
  const blocked = await prisma.blockedSlot.findMany({ where: { date } });
  return { leads, blocked };
}

// ─── Mark completed / follow-up with consultation notes ──────────────────────

export async function markLeadCompleted(
  leadId: string,
  patientPhone: string,
  input: {
    visitType?: VisitType;
    treatmentDone: string;
    notes: string;
    nextVisitDate?: string;
    paymentMode?: PaymentMode;
    paymentAmount?: number;
    transactionId?: string;
  }
) {
  const visitType = input.visitType ?? "consultation";
  // If visitType is followup, status becomes "followup"; otherwise "completed"
  const newStatus: LeadStatus = visitType === "followup" ? "followup" : "completed";

  await prisma.lead.update({ where: { id: leadId }, data: { status: newStatus } });

  return prisma.consultation.upsert({
    where: { leadId },
    update: {
      visitType,
      treatmentDone: input.treatmentDone,
      notes: input.notes,
      nextVisitDate: input.nextVisitDate ?? null,
      paymentMode: input.paymentMode ?? null,
      paymentAmount: input.paymentAmount ?? null,
      transactionId: input.transactionId ?? null,
      completedAt: new Date(),
    },
    create: {
      leadId,
      patientPhone,
      visitType,
      treatmentDone: input.treatmentDone,
      notes: input.notes,
      nextVisitDate: input.nextVisitDate,
      paymentMode: input.paymentMode,
      paymentAmount: input.paymentAmount,
      transactionId: input.transactionId,
    },
  });
}

// ─── Invoice: load lead + consultation for a given lead ──────────────────────

export async function getLeadForInvoice(leadId: string) {
  return prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      consultation: true,
      confirmedBy: { select: { name: true } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });
}

// ─── Documents ────────────────────────────────────────────────────────────────

export async function createDocument(input: {
  leadId: string;
  patientPhone: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  docType?: string;
  uploadedById: string;
  consultationId?: string;
}) {
  return prisma.document.create({
    data: {
      leadId: input.leadId,
      patientPhone: input.patientPhone,
      fileName: input.fileName,
      fileUrl: input.fileUrl,
      fileSize: input.fileSize,
      mimeType: input.mimeType ?? "",
      docType: input.docType ?? "other",
      uploadedById: input.uploadedById,
      consultationId: input.consultationId,
    },
  });
}

export async function getLeadDocuments(leadId: string) {
  return prisma.document.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteDocument(id: string) {
  return prisma.document.delete({ where: { id } });
}

// ─── Patient Portal ───────────────────────────────────────────────────────────

export async function getPatientByPhone(phone: string) {
  return prisma.patient.findUnique({
    where: { phone },
    include: {
      leads: { orderBy: { createdAt: "desc" } },
      consultations: { orderBy: { completedAt: "desc" } },
    },
  });
}

export async function createPatientSession(token: string, phone: string, expiresAt: Date) {
  return prisma.patientSession.create({ data: { token, phone, expiresAt } });
}

export async function getPatientSession(token: string) {
  return prisma.patientSession.findUnique({
    where: { token },
    include: { patient: true },
  });
}

export async function deletePatientSession(token: string) {
  return prisma.patientSession.deleteMany({ where: { token } });
}

// ─── Consultations ────────────────────────────────────────────────────────────

export async function createConsultation(input: {
  leadId: string;
  patientPhone: string;
  treatmentDone?: string;
  notes?: string;
  nextVisitDate?: string;
}) {
  return prisma.consultation.create({
    data: {
      leadId: input.leadId,
      patientPhone: input.patientPhone,
      treatmentDone: input.treatmentDone ?? "",
      notes: input.notes ?? "",
      nextVisitDate: input.nextVisitDate,
    },
  });
}

// ─── Legacy shape adapter ─────────────────────────────────────────────────────
// Keeps existing API routes working without changes

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  treatment: string;
  message: string;
  slot_date: string;
  slot_time: string;
  status: LeadStatus;
  source: string;
  confirmed_by?: string;
  confirmed_at?: string;
  whatsapp_confirm_sent: boolean;
  created_at: string;
  updated_at: string;
};

function leadToLegacy(lead: {
  id: string;
  name: string;
  phone: string;
  email: string;
  treatment: string;
  message: string;
  slotDate: string;
  slotTime: string;
  status: string;
  source: string;
  confirmedById: string | null;
  confirmedAt: Date | null;
  whatsappConfirmSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    treatment: lead.treatment,
    message: lead.message,
    slot_date: lead.slotDate,
    slot_time: lead.slotTime,
    status: lead.status as LeadStatus,
    source: lead.source,
    confirmed_by: lead.confirmedById ?? undefined,
    confirmed_at: lead.confirmedAt?.toISOString() ?? undefined,
    whatsapp_confirm_sent: lead.whatsappConfirmSent,
    created_at: lead.createdAt.toISOString(),
    updated_at: lead.updatedAt.toISOString(),
  };
}
