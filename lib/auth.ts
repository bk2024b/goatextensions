// Connexion à /admin : un mot de passe (ADMIN_PASSWORD), un cookie signé qui expire.
// Aucune dépendance : HMAC-SHA256 avec le module crypto de Node.

import { createHmac, createHash, timingSafeEqual } from "node:crypto";

export const COOKIE_NAME = "ge_admin";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8);
}

function sign(expires: number, secret: string): string {
  return createHmac("sha256", secret).update(`admin:${expires}`).digest("base64url");
}

function digest(s: string): Buffer {
  return createHash("sha256").update(s).digest();
}

/** Comparaison à temps constant du mot de passe saisi. */
export function passwordMatches(input: string): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || secret.length < 8) return false;
  return timingSafeEqual(digest(input), digest(secret));
}

export function createSessionValue(now: number = Date.now()): string {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  const expires = Math.floor(now / 1000) + SESSION_SECONDS;
  return `${expires}.${sign(expires, secret)}`;
}

export function verifySessionValue(value: string | undefined, now: number = Date.now()): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!value || !secret || secret.length < 8) return false;
  const [expRaw, sig] = value.split(".");
  const expires = Number(expRaw);
  if (!sig || !Number.isInteger(expires) || expires * 1000 < now) return false;
  const expected = sign(expires, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
