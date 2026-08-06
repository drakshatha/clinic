import { isSlotTaken } from "@/lib/db";
import { nowIstParts, todayIst } from "@/lib/time";
import { site } from "@/lib/site";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function minutesToLabel(totalMins: number) {
  let h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 || 12;
  return `${h12}:${pad(m)} ${ampm}`;
}

export function generateDaySlots() {
  const start = site.openHour * 60;
  const end = site.closeHour * 60 + 30; // 9:30 PM
  const slots: string[] = [];
  for (let t = start; t < end; t += 30) {
    slots.push(minutesToLabel(t));
  }
  return slots;
}

function labelToMinutes(label: string) {
  const match = label.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return -1;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function isPastSlot(date: string, timeLabel: string) {
  const today = todayIst();
  if (date > today) return false;
  if (date < today) return true;
  const now = nowIstParts();
  const nowMins = now.hour * 60 + now.minute;
  return labelToMinutes(timeLabel) <= nowMins;
}

export function getSlotsForDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid date");
  }
  return generateDaySlots().map((time) => {
    const past = isPastSlot(date, time);
    const taken = isSlotTaken(date, time);
    return {
      time,
      available: !past && !taken,
      reason: past ? "past" : taken ? "booked" : null,
    };
  });
}

export function getOpenDates(daysAhead = 14) {
  const dates = [];
  const start = new Date(`${todayIst()}T12:00:00+05:30`);
  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const openCount = getSlotsForDate(iso).filter((s) => s.available).length;
    dates.push({
      date: iso,
      label: d.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      openCount,
      hasSlots: openCount > 0,
    });
  }
  return dates;
}
