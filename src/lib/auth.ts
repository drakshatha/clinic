import { cookies } from "next/headers";
import {
  hashPassword,
  id,
  readDb,
  writeDb,
  type Session,
  type StaffRole,
} from "@/lib/db";

const COOKIE = "akshatha_staff_session";

export async function loginStaff(username: string, password: string) {
  const db = readDb();
  const user = db.staff.find((s) => s.username === username.trim().toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return { ok: false as const, error: "Invalid username or password" };
  }

  const token = id("sess_");
  const session: Session = {
    token,
    userId: user.id,
    role: user.role,
    name: user.name,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
  db.sessions = db.sessions.filter((s) => s.userId !== user.id);
  db.sessions.push(session);
  writeDb(db);

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
  if (token) {
    const db = readDb();
    db.sessions = db.sessions.filter((s) => s.token !== token);
    writeDb(db);
  }
  jar.delete(COOKIE);
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const db = readDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    db.sessions = db.sessions.filter((s) => s.token !== token);
    writeDb(db);
    return null;
  }
  return session;
}

export async function requireStaff(roles?: StaffRole[]) {
  const session = await getSession();
  if (!session) return null;
  if (roles && !roles.includes(session.role)) return null;
  return session;
}
