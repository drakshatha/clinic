/** Client-safe IST "today" for date inputs */
export function todayIst() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}
