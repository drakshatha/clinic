import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "clinic.json");

export type StaffRole = "doctor" | "assistant";

export type LeadStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  treatment: string;
  message: string;
  slot_date: string; // YYYY-MM-DD
  slot_time: string; // e.g. 5:30 PM
  status: LeadStatus;
  source: string;
  confirmed_by?: string;
  confirmed_at?: string;
  whatsapp_confirm_sent?: boolean;
  created_at: string; // ISO UTC
  updated_at: string;
};

export type OtpRecord = {
  phone: string;
  codeHash: string;
  expiresAt: string;
  attempts: number;
  verified: boolean;
};

export type StaffUser = {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  role: StaffRole;
};

export type Session = {
  token: string;
  userId: string;
  role: StaffRole;
  name: string;
  expiresAt: string;
};

export type DbShape = {
  leads: Lead[];
  blockedSlots: { id: string; date: string; time: string; reason: string }[];
  otps: OtpRecord[];
  sessions: Session[];
  staff: StaffUser[];
  updatedAt: string;
};

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function id(prefix = "") {
  return `${prefix}${crypto.randomBytes(6).toString("hex")}`;
}

function defaultStaff(): StaffUser[] {
  return [
    {
      id: "staff_doctor",
      name: "Dr. Akshatha V",
      username: "doctor",
      // password: doctor2026
      passwordHash: hash("doctor2026"),
      role: "doctor",
    },
    {
      id: "staff_assistant",
      name: "Clinic Assistant",
      username: "assistant",
      // password: assist2026
      passwordHash: hash("assist2026"),
      role: "assistant",
    },
  ];
}

function defaultDb(): DbShape {
  return {
    leads: [],
    blockedSlots: [],
    otps: [],
    sessions: [],
    staff: defaultStaff(),
    updatedAt: new Date().toISOString(),
  };
}

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb(), null, 2));
  }
}

export function readDb(): DbShape {
  ensureDb();
  try {
    const raw = JSON.parse(fs.readFileSync(DB_FILE, "utf8")) as DbShape;
    if (!raw.staff?.length) raw.staff = defaultStaff();
    if (!raw.leads) raw.leads = [];
    if (!raw.otps) raw.otps = [];
    if (!raw.sessions) raw.sessions = [];
    if (!raw.blockedSlots) raw.blockedSlots = [];
    return raw;
  } catch {
    return defaultDb();
  }
}

export function writeDb(db: DbShape) {
  ensureDb();
  db.updatedAt = new Date().toISOString();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function hashPassword(password: string) {
  return hash(password);
}

export function hashOtp(code: string, phone: string) {
  return hash(`${phone}:${code}`);
}

export function createLead(
  input: Omit<Lead, "id" | "created_at" | "updated_at" | "status"> & {
    status?: LeadStatus;
  }
): Lead {
  const db = readDb();
  const now = new Date().toISOString();
  const lead: Lead = {
    id: id("lead_"),
    name: input.name,
    phone: input.phone,
    email: input.email || "",
    treatment: input.treatment || "",
    message: input.message || "",
    slot_date: input.slot_date,
    slot_time: input.slot_time,
    status: input.status || "pending",
    source: input.source || "website",
    created_at: now,
    updated_at: now,
  };
  db.leads.unshift(lead);
  writeDb(db);
  return lead;
}

export function updateLead(leadId: string, patch: Partial<Lead>) {
  const db = readDb();
  const idx = db.leads.findIndex((l) => l.id === leadId);
  if (idx < 0) return null;
  db.leads[idx] = {
    ...db.leads[idx],
    ...patch,
    id: leadId,
    updated_at: new Date().toISOString(),
  };
  writeDb(db);
  return db.leads[idx];
}

export function getLead(leadId: string) {
  return readDb().leads.find((l) => l.id === leadId) || null;
}

export function isSlotTaken(date: string, time: string) {
  const db = readDb();
  const booked = db.leads.some(
    (l) =>
      l.slot_date === date &&
      l.slot_time === time &&
      l.status !== "cancelled"
  );
  const blocked = db.blockedSlots.some((b) => b.date === date && b.time === time);
  return booked || blocked;
}

export { id, hash };
