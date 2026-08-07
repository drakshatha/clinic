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
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { confirmedBy: { select: { name: true, role: true } } },
  });
  return leads.map((l) => leadToLegacy(l, l.confirmedBy ?? undefined));
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

export async function getAllPatients() {
  return prisma.patient.findMany({
    orderBy: { lastSeen: "desc" },
    include: {
      leads: { select: { id: true, status: true, slotDate: true, slotTime: true, treatment: true } },
      consultations: { select: { id: true, completedAt: true, paymentAmount: true, visitType: true } },
      medicalHistory: true,
    },
  });
}

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

// ─── Appointment Reminders ────────────────────────────────────────────────────

/** Returns confirmed leads that need a 24h or 1h reminder, filtered by the
 *  caller — pass which window to check. Does NOT update the flags; caller does. */
export async function getLeadsNeedingReminders() {
  return prisma.lead.findMany({
    where: {
      status: "confirmed",
      OR: [{ reminder24hSent: false }, { reminder1hSent: false }],
    },
    select: {
      id: true,
      name: true,
      phone: true,
      treatment: true,
      slotDate: true,
      slotTime: true,
      reminder24hSent: true,
      reminder1hSent: true,
    },
  });
}

export async function markReminderSent(leadId: string, type: "24h" | "1h") {
  const data =
    type === "24h" ? { reminder24hSent: true } : { reminder1hSent: true };
  return prisma.lead.update({ where: { id: leadId }, data });
}

// ─── Outstanding Payments ─────────────────────────────────────────────────────

export async function getOutstandingPayments() {
  return prisma.consultation.findMany({
    where: {
      OR: [
        { paymentMode: null },
        { paymentMode: "pending" },
        { paymentAmount: null },
      ],
      lead: { status: { notIn: ["cancelled", "pending"] } },
    },
    orderBy: { completedAt: "desc" },
    include: {
      lead: { select: { id: true, name: true, phone: true, treatment: true, slotDate: true, slotTime: true } },
    },
  });
}

// ─── Medical History ──────────────────────────────────────────────────────────

export async function getMedicalHistory(patientPhone: string) {
  return prisma.medicalHistory.findUnique({ where: { patientPhone } });
}

export async function upsertMedicalHistory(
  patientPhone: string,
  data: {
    bloodGroup?: string;
    allergies?: string;
    currentMedications?: string;
    medicalConditions?: string;
    smokingStatus?: string;
    isPregnant?: string;
    dentalConcerns?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  }
) {
  return prisma.medicalHistory.upsert({
    where: { patientPhone },
    update: data,
    create: { patientPhone, ...data },
  });
}

// ─── Treatment Plans ──────────────────────────────────────────────────────────

export async function getTreatmentPlans(patientPhone?: string) {
  return prisma.treatmentPlan.findMany({
    where: patientPhone ? { patientPhone } : undefined,
    include: {
      phases: { orderBy: { phaseNumber: "asc" } },
      patient: { select: { name: true, phone: true } },
      createdBy: { select: { name: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTreatmentPlan(id: string) {
  return prisma.treatmentPlan.findUnique({
    where: { id },
    include: {
      phases: { orderBy: { phaseNumber: "asc" } },
      patient: { select: { name: true, phone: true } },
      createdBy: { select: { name: true, role: true } },
    },
  });
}

export async function createTreatmentPlan(input: {
  patientPhone: string;
  title: string;
  notes?: string;
  createdById: string;
  phases: Array<{ title: string; description?: string; estimatedCost: number; duration?: string }>;
}) {
  const totalCost = input.phases.reduce((s, p) => s + p.estimatedCost, 0);
  return prisma.treatmentPlan.create({
    data: {
      patientPhone: input.patientPhone,
      title: input.title,
      notes: input.notes ?? "",
      totalCost,
      createdById: input.createdById,
      phases: {
        create: input.phases.map((p, i) => ({
          phaseNumber: i + 1,
          title: p.title,
          description: p.description ?? "",
          estimatedCost: p.estimatedCost,
          duration: p.duration ?? "",
        })),
      },
    },
    include: {
      phases: { orderBy: { phaseNumber: "asc" } },
      patient: { select: { name: true, phone: true } },
    },
  });
}

export async function updateTreatmentPlan(
  id: string,
  patch: {
    title?: string;
    notes?: string;
    status?: string;
    sharedAt?: Date | null;
    phases?: Array<{ title: string; description?: string; estimatedCost: number; duration?: string }>;
  }
) {
  const data: Record<string, unknown> = {};
  if (patch.title !== undefined) data.title = patch.title;
  if (patch.notes !== undefined) data.notes = patch.notes;
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.sharedAt !== undefined) data.sharedAt = patch.sharedAt;

  if (patch.phases) {
    data.totalCost = patch.phases.reduce((s, p) => s + p.estimatedCost, 0);
    // Replace all phases
    await prisma.treatmentPlanPhase.deleteMany({ where: { planId: id } });
    await prisma.treatmentPlanPhase.createMany({
      data: patch.phases.map((p, i) => ({
        planId: id,
        phaseNumber: i + 1,
        title: p.title,
        description: p.description ?? "",
        estimatedCost: p.estimatedCost,
        duration: p.duration ?? "",
      })),
    });
  }

  return prisma.treatmentPlan.update({
    where: { id },
    data,
    include: {
      phases: { orderBy: { phaseNumber: "asc" } },
      patient: { select: { name: true, phone: true } },
    },
  });
}

export async function deleteTreatmentPlan(id: string) {
  return prisma.treatmentPlan.delete({ where: { id } });
}

export async function markPhaseCompleted(phaseId: string, isCompleted: boolean) {
  return prisma.treatmentPlanPhase.update({ where: { id: phaseId }, data: { isCompleted } });
}

// ─── Visit Feedback ───────────────────────────────────────────────────────────

export async function createFeedbackToken(leadId: string, patientPhone: string) {
  const { randomBytes } = await import("crypto");
  const token = randomBytes(12).toString("base64url");
  return prisma.visitFeedback.upsert({
    where: { leadId },
    update: { token, submittedAt: null, rating: null, comment: "" },
    create: { token, leadId, patientPhone },
  });
}

export async function getFeedback(token: string) {
  return prisma.visitFeedback.findUnique({
    where: { token },
    include: { lead: { select: { name: true, treatment: true, patientPhone: true } } },
  });
}

export async function submitFeedback(token: string, rating: number, comment: string) {
  return prisma.visitFeedback.update({
    where: { token },
    data: { rating, comment, submittedAt: new Date() },
  });
}

export async function markReviewRequested(token: string) {
  return prisma.visitFeedback.update({ where: { token }, data: { reviewRequested: true } });
}

export async function getRecentFeedback(limit = 50) {
  return prisma.visitFeedback.findMany({
    where: { submittedAt: { not: null } },
    include: { lead: { select: { name: true, treatment: true, slotDate: true } } },
    orderBy: { submittedAt: "desc" },
    take: limit,
  });
}

// ─── Lab Work ─────────────────────────────────────────────────────────────────

export async function getAllLabWork() {
  return prisma.labWork.findMany({
    include: { lead: { select: { name: true, phone: true, treatment: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createLabWork(input: {
  leadId: string;
  patientPhone: string;
  patientName: string;
  labName: string;
  workType: string;
  description?: string;
  sentDate: string;
  expectedDate?: string;
  notes?: string;
}) {
  return prisma.labWork.create({
    data: {
      leadId: input.leadId,
      patientPhone: input.patientPhone,
      patientName: input.patientName,
      labName: input.labName,
      workType: input.workType,
      description: input.description ?? "",
      sentDate: input.sentDate,
      expectedDate: input.expectedDate,
      notes: input.notes ?? "",
    },
  });
}

export async function updateLabWork(
  id: string,
  patch: { status?: string; receivedDate?: string; notes?: string; expectedDate?: string }
) {
  return prisma.labWork.update({ where: { id }, data: patch });
}

export async function deleteLabWork(id: string) {
  return prisma.labWork.delete({ where: { id } });
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export async function getAllGallery(publicOnly = false) {
  return prisma.galleryCase.findMany({
    where: publicOnly ? { isPublic: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function createGalleryCase(input: {
  title: string;
  treatment?: string;
  beforeUrl: string;
  afterUrl: string;
  description?: string;
  isPublic?: boolean;
}) {
  return prisma.galleryCase.create({
    data: {
      title: input.title,
      treatment: input.treatment ?? "",
      beforeUrl: input.beforeUrl,
      afterUrl: input.afterUrl,
      description: input.description ?? "",
      isPublic: input.isPublic ?? true,
    },
  });
}

export async function updateGalleryCase(
  id: string,
  patch: { title?: string; treatment?: string; description?: string; isPublic?: boolean; sortOrder?: number }
) {
  return prisma.galleryCase.update({ where: { id }, data: patch });
}

export async function deleteGalleryCase(id: string) {
  return prisma.galleryCase.delete({ where: { id } });
}

// ─── Recall System ────────────────────────────────────────────────────────────

/** Patients whose last consultation was >6 months ago (or never) and haven't been recalled recently */
export async function getPatientsForRecall() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return prisma.patient.findMany({
    where: {
      leads: { some: {} }, // has at least one lead
      AND: [
        // Last recall was >5 months ago or never
        {
          OR: [
            { lastRecallAt: null },
            { lastRecallAt: { lt: new Date(Date.now() - 150 * 24 * 3600_000) } }, // 5 months
          ],
        },
        // No recent completed visits in last 6 months
        {
          consultations: {
            none: { completedAt: { gte: sixMonthsAgo } },
          },
        },
      ],
    },
    select: { phone: true, name: true, lastRecallAt: true, lastSeen: true },
    orderBy: { lastSeen: "asc" },
  });
}

export async function markRecallSent(phone: string) {
  return prisma.patient.update({ where: { phone }, data: { lastRecallAt: new Date() } });
}

// ─── Birthday System ──────────────────────────────────────────────────────────

export async function getPatientsWithBirthdayToday() {
  // IST today MMDD
  const now = new Date(Date.now() + 5.5 * 3600_000);
  const mmdd = `${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
  // dob is stored as YYYY-MM-DD; match last 5 chars = -MM-DD
  return prisma.patient.findMany({
    where: { dob: { endsWith: `-${mmdd}` } },
    select: { phone: true, name: true, dob: true },
  });
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

function leadToLegacy(
  lead: {
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
  },
  confirmedByStaff?: { name: string; role: string }
) {
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
    confirmed_by: confirmedByStaff
      ? `${confirmedByStaff.name} (${confirmedByStaff.role})`
      : (lead.confirmedById ?? undefined),
    confirmed_at: lead.confirmedAt?.toISOString() ?? undefined,
    whatsapp_confirm_sent: lead.whatsappConfirmSent,
    created_at: lead.createdAt.toISOString(),
    updated_at: lead.updatedAt.toISOString(),
  };
}
