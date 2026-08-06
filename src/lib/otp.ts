import { hashOtp, readDb, writeDb } from "@/lib/db";
import { normalizePhone, sendWhatsAppText } from "@/lib/whatsapp";

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendSmsMsg91(phone: string, code: string) {
  const key = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  if (!key || !templateId) return { sent: false, provider: "msg91", reason: "not_configured" };

  const mobile = normalizePhone(phone);
  const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${mobile}&otp=${code}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { authkey: key, "Content-Type": "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  return { sent: res.ok, provider: "msg91", data };
}

async function sendSmsTwilio(phone: string, code: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) return { sent: false, provider: "twilio", reason: "not_configured" };

  const to = `+${normalizePhone(phone)}`;
  const body = new URLSearchParams({
    To: to,
    From: from,
    Body: `Your Akshatha Dental verification code is ${code}. Valid for 5 minutes.`,
  });
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );
  const data = await res.json().catch(() => ({}));
  return { sent: res.ok, provider: "twilio", data };
}

/**
 * OTP send strategy (first match wins):
 * 1. MSG91 (India SMS) — recommended for clinics
 * 2. Twilio SMS
 * 3. WhatsApp Cloud API text
 * 4. Dev mode — code returned in API + logged (local testing)
 */
export async function sendOtp(phoneRaw: string) {
  const phone = normalizePhone(phoneRaw);
  if (phone.length < 10) throw new Error("Invalid phone number");

  const code = generateCode();
  const db = readDb();
  db.otps = db.otps.filter((o) => o.phone !== phone);
  db.otps.push({
    phone,
    codeHash: hashOtp(code, phone),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    attempts: 0,
    verified: false,
  });
  writeDb(db);

  const msg91 = await sendSmsMsg91(phone, code);
  if (msg91.sent) return { ok: true, channel: "sms_msg91", devCode: null as string | null };

  const twilio = await sendSmsTwilio(phone, code);
  if (twilio.sent) return { ok: true, channel: "sms_twilio", devCode: null as string | null };

  const wa = await sendWhatsAppText(
    phone,
    `Your Akshatha Dental verification code is ${code}. Valid for 5 minutes.`
  );
  if (wa.sent) return { ok: true, channel: "whatsapp", devCode: null as string | null };

  // Dev / fallback
  console.log(`[OTP] ${phone} => ${code}`);
  const allowDev = process.env.OTP_DEV_MODE !== "false";
  return {
    ok: true,
    channel: "dev",
    devCode: allowDev ? code : null,
    hint: allowDev
      ? "No SMS provider configured. Using dev OTP (shown once)."
      : "Configure MSG91 / Twilio / WhatsApp to deliver OTP.",
  };
}

export function verifyOtp(phoneRaw: string, code: string) {
  const phone = normalizePhone(phoneRaw);
  const db = readDb();
  const idx = db.otps.findIndex((o) => o.phone === phone);
  if (idx < 0) return { ok: false, error: "OTP not found. Please request a new code." };

  const record = db.otps[idx];
  if (new Date(record.expiresAt).getTime() < Date.now()) {
    return { ok: false, error: "OTP expired. Please request a new code." };
  }
  if (record.attempts >= 5) {
    return { ok: false, error: "Too many attempts. Request a new OTP." };
  }

  record.attempts += 1;
  if (record.codeHash !== hashOtp(code.trim(), phone)) {
    writeDb(db);
    return { ok: false, error: "Invalid OTP." };
  }

  record.verified = true;
  writeDb(db);
  return { ok: true };
}

export function consumeVerifiedOtp(phoneRaw: string) {
  const phone = normalizePhone(phoneRaw);
  const db = readDb();
  const record = db.otps.find((o) => o.phone === phone);
  if (!record?.verified) return false;
  if (new Date(record.expiresAt).getTime() < Date.now()) return false;
  db.otps = db.otps.filter((o) => o.phone !== phone);
  writeDb(db);
  return true;
}
