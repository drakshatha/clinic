/** IST (Asia/Kolkata) helpers */

const IST = "Asia/Kolkata";

export function nowIstParts() {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(new Date()).map((p) => [p.type, p.value])
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

export function todayIst() {
  return nowIstParts().date;
}

export function formatIstDateTime(isoUtc: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(isoUtc));
}

export function formatSlotLabel(date: string, time: string) {
  const d = new Date(`${date}T12:00:00+05:30`);
  const day = d.toLocaleDateString("en-IN", {
    timeZone: IST,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${day} · ${time} IST`;
}

export function formatDateIst(date: string) {
  const d = new Date(`${date}T12:00:00+05:30`);
  return d.toLocaleDateString("en-IN", {
    timeZone: IST,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
