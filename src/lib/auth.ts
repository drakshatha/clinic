import { cookies } from "next/headers";
import crypto from "crypto";
import {
  hashPassword,
  getStaffByUsername,
  createSession,
  getSession as dbGetSession,
  deleteSession,
} from "@/lib/db";
import { parsePermissions, type Permission } from "@/lib/permissions";

const COOKIE = "akshatha_staff_session";

function makeToken(prefix = "sess_") {
  return `${prefix}${crypto.randomBytes(16).toString("hex")}`;
}

export async function loginStaff(username: string, password: string) {
  const user = await getStaffByUsername(username.trim().toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return { ok: false as const, error: "Invalid username or password" };
  }

  const token = makeToken("sess_");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await createSession(token, user.id, user.role, user.name, user.permissions, expiresAt);

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60,
  });

  return {
    ok: true as const,
    user: { id: user.id, name: user.name, role: user.role, username: user.username },
  };
}

export async function logoutStaff() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await deleteSession(token);
  jar.delete(COOKIE);
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  const session = await dbGetSession(token);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await deleteSession(token);
    return null;
  }

  const permissions = parsePermissions(session.permissions);
  return {
    token: session.token,
    userId: session.userId,
    role: session.role,
    name: session.name,
    permissions,
    isOwner: session.user.isOwner,
  };
}

/** Require a valid session. Optionally require a specific permission. */
export async function requireStaff(permission?: Permission) {
  const session = await getSession();
  if (!session) return null;
  if (permission && !session.permissions.includes(permission)) return null;
  return session;
}
