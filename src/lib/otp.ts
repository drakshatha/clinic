import { hashOtp, upsertOtp, getOtp, incrementOtpAttempts, markOtpVerified, deleteOtp } from "@/lib/db";
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

export async function sendOtp(phoneRaw: string) {
  const phone = normalizePhone(phoneRaw);
  if (phone.length < 10) throw new Error("Invalid phone number");

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await upsertOtp(phone, hashOtp(code, phone), expiresAt);

  const msg91 = await sendSmsMsg91(phone, code);
  if (msg91.sent) return { ok: true, channel: "sms_msg91", devCode: null as string | null };

  const twilio = await sendSmsTwilio(phone, code);
  if (twilio.sent) return { ok: true, channel: "sms_twilio", devCode: null as string | null };

  const wa = await sendWhatsAppText(
    phone,
    `Your Akshatha Dental verification code is ${code}. Valid for 5 minutes.`
  );
  if (wa.sent) return { ok: true, channel: "whatsapp", devCode: null as string | null };

  // Dev / fallback — shows OTP in response for local testing
  console.log(`[OTP] ${phone} => ${code}`);
  const allowDev = process.env.OTP_DEV_MODE !== "false";
  return {
    ok: true,
    channel: "dev",
    devCode: allowDev ? code : null,
  };
}

export async function verifyOtp(phoneRaw: string, code: string) {
  const phone = normalizePhone(phoneRaw);
  const record = await getOtp(phone);
  if (!record) return { ok: false, error: "OTP not found. Please request a new code." };

  if (new Date(record.expiresAt).getTime() < Date.now()) {
    return { ok: false, error: "OTP expired. Please request a new code." };
  }
  if (record.attempts >= 5) {
    return { ok: false, error: "Too many attempts. Request a new OTP." };
  }

  await incrementOtpAttempts(phone);

  if (record.codeHash !== hashOtp(code.trim(), phone)) {
    return { ok: false, error: "Invalid OTP." };
  }

  await markOtpVerified(phone);
  return { ok: true };
}

export async function consumeVerifiedOtp(phoneRaw: string) {
  const phone = normalizePhone(phoneRaw);
  const record = await getOtp(phone);
  if (!record?.verified) return false;
  if (new Date(record.expiresAt).getTime() < Date.now()) return false;
  await deleteOtp(phone);
  return true;
}
