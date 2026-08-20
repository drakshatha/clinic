/**
 * Authentication for the /edit site-editor area.
 * Uses a separate password from the clinic admin panel so both can have
 * different credentials and neither can access the other's area.
 *
 * Env var required: SITE_EDITOR_PASSWORD
 * Cookie: site_editor_session (http-only, path=/edit)
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";

const COOKIE = "site_editor_session";
const PREFIX = "site-edit:";

/** Derive a stable token from the password (changing the password invalidates all sessions). */
function makeToken(password: string): string {
  return createHash("sha256").update(`${PREFIX}${password}`).digest("hex");
}

/** Returns true if the current request has a valid editor session cookie. */
export async function isSiteEditor(): Promise<boolean> {
  const password = process.env.SITE_EDITOR_PASSWORD;
  if (!password) return false;
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  return token === makeToken(password);
}

/** Server-component guard: redirects to /edit/login if not authenticated. */
export async function requireSiteEditor(): Promise<void> {
  const ok = await isSiteEditor();
  if (!ok) redirect("/edit/login");
}

/** Returns the session token for a correct password, or null if wrong. */
export function verifyEditorPassword(password: string): string | null {
  const correct = process.env.SITE_EDITOR_PASSWORD;
  if (!correct || password !== correct) return null;
  return makeToken(correct);
}

export { COOKIE as EDITOR_COOKIE };
