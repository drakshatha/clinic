/**
 * permissions.ts — all capability keys and their human labels.
 * Add new pages/actions here; update AdminShell and API routes to check them.
 */

export const PERMISSIONS = {
  view_leads:      "View Leads & Appointments",
  confirm_leads:   "Confirm / Cancel Appointments",
  view_calendar:   "View Calendar",
  block_slots:     "Block / Unblock Slots",
  complete_visits: "Mark Completed + Consultation Notes",
  manage_staff:    "Manage Staff (add / edit / remove)",
} as const;

export type Permission = keyof typeof PERMISSIONS;

export const ALL_PERMISSIONS = Object.keys(PERMISSIONS) as Permission[];

/** Full access — for the owner / doctor account */
export const OWNER_PERMISSIONS: Permission[] = [...ALL_PERMISSIONS];

/** Default for a new assistant-level account */
export const DEFAULT_PERMISSIONS: Permission[] = [
  "view_leads",
  "confirm_leads",
  "view_calendar",
];

export function parsePermissions(json: string): Permission[] {
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    return arr.filter((p) => p in PERMISSIONS) as Permission[];
  } catch {
    return [];
  }
}

export function hasPermission(permissions: Permission[], key: Permission) {
  return permissions.includes(key);
}
