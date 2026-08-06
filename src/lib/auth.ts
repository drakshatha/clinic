import { cookies } from "next/headers";
import crypto from "crypto";
import {
  hashPassword,
  getStaffByUsername,
  createSession,
  getSession as dbGetSession,
  deleteSession,
  type StaffRole,
} from "@/lib/db";

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
  await createSession(token, user.id, user.role, user.name, expiresAt);

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
    user: { id: user.id, name: user.name, role: user.role as StaffRole, username: user.username },
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
  return { token: session.token, userId: session.userId, role: session.role as StaffRole, name: session.name };
}

export async function requireStaff(roles?: StaffRole[]) {
  const session = await getSession();
  if (!session) return null;
  if (roles && !roles.includes(session.role as StaffRole)) return null;
  return session;
}
