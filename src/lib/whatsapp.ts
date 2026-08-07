import { site } from "@/lib/site";
import type { Lead } from "@/lib/db";
import { formatSlotLabel } from "@/lib/time";

export function normalizePhone(phone: string) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith("91") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 11) return `91${digits.slice(1)}`;
  return digits;
}

export function patientConfirmMessage(lead: Lead) {
  return (
    `Hi ${lead.name}, your appointment at ${site.name} is *confirmed*.\n\n` +
    `📅 Slot: ${formatSlotLabel(lead.slot_date, lead.slot_time)}\n` +
    (lead.treatment ? `🦷 Treatment: ${lead.treatment}\n` : "") +
    `\n📍 ${site.address}\n` +
    `📞 ${site.phoneDisplay}\n\n` +
    `Please arrive 10 minutes early. Reply if you need to reschedule.`
  );
}

export function clinicNotifyMessage(lead: Lead) {
  return [
    `New appointment request`,
    ``,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
    `Slot: ${formatSlotLabel(lead.slot_date, lead.slot_time)}`,
    lead.treatment ? `Treatment: ${lead.treatment}` : null,
    lead.message ? `Message: ${lead.message}` : null,
    `Lead ID: ${lead.id}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function waLink(phoneDigits: string, text: string) {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`;
}

export async function sendWhatsAppText(toPhone: string, text: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) {
    return { sent: false, reason: "api_not_configured" as const };
  }

  const to = normalizePhone(toPhone);
  const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    });
    const data = await res.json();
    if (!res.ok) return { sent: false, reason: "api_error" as const, data };
    return { sent: true as const, data };
  } catch (err) {
    return {
      sent: false,
      reason: err instanceof Error ? err.message : "send_failed",
    };
  }
}

export function reminder24hMessage(lead: {
  name: string;
  phone: string;
  treatment: string;
  slotDate: string;
  slotTime: string;
}) {
  const label = formatSlotLabel(lead.slotDate, lead.slotTime);
  return (
    `Hi ${lead.name} 👋\n\n` +
    `This is a friendly reminder from *${site.name}*.\n\n` +
    `Your appointment is *tomorrow*:\n` +
    `📅 ${label}\n` +
    (lead.treatment ? `🦷 Treatment: ${lead.treatment}\n` : "") +
    `\n📍 ${site.address}\n` +
    `📞 ${site.phoneDisplay}\n\n` +
    `Please arrive 10 minutes early. Reply here or call us to reschedule.`
  );
}

export function reminder1hMessage(lead: {
  name: string;
  phone: string;
  treatment: string;
  slotDate: string;
  slotTime: string;
}) {
  return (
    `Hi ${lead.name} 👋\n\n` +
    `Your appointment at *${site.name}* is in about *1 hour*.\n\n` +
    `⏰ Today at *${lead.slotTime}*\n` +
    (lead.treatment ? `🦷 Treatment: ${lead.treatment}\n` : "") +
    `\n📍 ${site.address}\n\n` +
    `We look forward to seeing you! 🦷`
  );
}

export function paymentReminderMessage(name: string, amount?: number | null) {
  const amt = amount ? `₹${amount.toLocaleString("en-IN")}` : "your treatment amount";
  return (
    `Hi ${name} 👋\n\n` +
    `This is a gentle reminder from *${site.name}* regarding a pending payment of *${amt}*.\n\n` +
    `Please make the payment at your earliest convenience.\n` +
    `📞 ${site.phoneDisplay}\n\n` +
    `Thank you! 🙏`
  );
}

export function bookingLinks(lead: Lead) {
  return {
    clinicInbox: waLink(site.whatsapp, clinicNotifyMessage(lead)),
    patientConfirm: waLink(normalizePhone(lead.phone), patientConfirmMessage(lead)),
    confirmText: patientConfirmMessage(lead),
  };
}
