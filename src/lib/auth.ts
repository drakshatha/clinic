/**
 * auth.ts — JWT-based session management.
 *
 * Session data is stored in a signed HttpOnly cookie (no DB hit on every request).
 * Login still verifies credentials against the DB; all other page loads are instant.
 *
 * Algorithm: HMAC-SHA256 over base64url(header).base64url(payload), using
 * SESSION_SECRET env var as the key. Falls back to a dev-only insecure default.
 */
import { cookies } from "next/headers";
import crypto from "crypto";
import {
  hashPassword,
  getStaffByUsername,
} from "@/lib/db";
import { parsePermissions, type Permission } from "@/lib/permissions";

const COOKIE = "akshatha_staff_session";
const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "dev-only-insecure-secret-change-me-in-prod";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── JWT helpers ──────────────────────────────────────────────────────────────

function b64url(str: string): string {
  return Buffer.from(str).toString("base64url");
}

function fromB64url(str: string): string {
  return Buffer.from(str, "base64url").toString("utf8");
}

function sign(data: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
}

interface JwtPayload {
  userId: string;
  role: string;
  name: string;
  permissions: string; // JSON-encoded string[]
  isOwner: boolean;
  exp: number; // Unix seconds
}

function createJwt(payload: JwtPayload): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  const sig = sign(`${header}.${body}`);
  return `${header}.${body}.${sig}`;
}

function verifyJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const expected = sign(`${header}.${body}`);
    if (
      !crypto.timingSafeEqual(
        Buffer.from(sig, "base64url"),
        Buffer.from(expected, "base64url"),
      )
    ) {
      return null;
    }
    const payload = JSON.parse(fromB64url(body)) as JwtPayload;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function loginStaff(username: string, password: string) {
  const user = await getStaffByUsername(username.trim().toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return { ok: false as const, error: "Invalid username or password" };
  }

  const exp = Math.floor((Date.now() + SESSION_TTL_MS) / 1000);
  const jwt = createJwt({
    userId: user.id,
    role: user.role,
    name: user.name,
    permissions: user.permissions ?? "[]",
    isOwner: user.isOwner,
    exp,
  });

  const jar = await cookies();
  jar.set(COOKIE, jwt, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS / 1000,
  });

  return {
    ok: true as const,
    user: { id: user.id, name: user.name, role: user.role, username: user.username },
  };
}

export async function logoutStaff() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** Returns session data — verified entirely from the cookie, zero DB hits. */
export async function getSession() {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;

  const payload = verifyJwt(raw);
  if (!payload) return null;

  const permissions = parsePermissions(payload.permissions);
  return {
    token: raw,          // kept for API compat — it's now the JWT itself
    userId: payload.userId,
    role: payload.role,
    name: payload.name,
    permissions,
    isOwner: payload.isOwner,
  };
}

/** Require a valid session. Optionally require a specific permission. */
export async function requireStaff(permission?: Permission) {
  const session = await getSession();
  if (!session) return null;
  if (permission && !session.permissions.includes(permission)) return null;
  return session;
}
