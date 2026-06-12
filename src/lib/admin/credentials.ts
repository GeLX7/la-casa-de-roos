/**
 * Pure credential/session primitives for Admin Mode — node:crypto only, no
 * framework imports, so scripts/hash-admin-password.mjs and tests can reuse
 * them. Pattern: salted PBKDF2 password hashes in env vars plus a stateless
 * HMAC-signed session value. No plaintext password and no hash ever live in
 * the repo or the database.
 *
 * Hash format: pbkdf2$<iterations>$<digest>$<salt>$<hex>
 */

import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const PBKDF2_ITERATIONS = 210_000;
const PBKDF2_DIGEST = "sha256";
const PBKDF2_KEYLEN = 32;
const MIN_ITERATIONS = 100_000;

export const MIN_SESSION_SECRET_LENGTH = 32;

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createPasswordHash(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString("hex");
  return `pbkdf2$${PBKDF2_ITERATIONS}$${PBKDF2_DIGEST}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string | undefined): boolean {
  if (!storedHash) return false;
  const [kind, iterationsRaw, digest, salt, expected] = storedHash.split("$");
  if (kind !== "pbkdf2" || !iterationsRaw || !digest || !salt || !expected) return false;

  const iterations = Number(iterationsRaw);
  if (!Number.isInteger(iterations) || iterations < MIN_ITERATIONS) return false;

  try {
    const actual = pbkdf2Sync(password, salt, iterations, PBKDF2_KEYLEN, digest).toString("hex");
    return safeEqual(actual, expected);
  } catch {
    // Unknown digest or malformed salt: treat as non-matching, never throw.
    return false;
  }
}

/**
 * Burns the same PBKDF2 cost as a real verification. Called when the
 * username does not match, so an attacker cannot distinguish "wrong
 * username" from "wrong password" by response timing.
 */
export function burnPasswordVerification(password: string): void {
  pbkdf2Sync(password, "timing-equalizer", PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST);
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/** Session value format: <encodedUsername>.<expiresAtEpochSeconds>.<hmac> */
export function createSessionValue(
  username: string,
  secret: string,
  ttlSeconds: number,
  nowMs = Date.now(),
): string {
  const expiresAt = Math.floor(nowMs / 1000) + ttlSeconds;
  const payload = `${encodeURIComponent(username)}.${expiresAt}`;
  return `${payload}.${sign(payload, secret)}`;
}

/** Returns the username when the value is authentic and unexpired, else null. */
export function verifySessionValue(
  value: string | undefined,
  secret: string,
  nowMs = Date.now(),
): string | null {
  if (!value || secret.length < MIN_SESSION_SECRET_LENGTH) return null;

  const [encodedUsername, expiresAtRaw, signature] = value.split(".");
  if (!encodedUsername || !expiresAtRaw || !signature) return null;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(nowMs / 1000)) return null;

  const payload = `${encodedUsername}.${expiresAtRaw}`;
  if (!safeEqual(signature, sign(payload, secret))) return null;

  try {
    return decodeURIComponent(encodedUsername);
  } catch {
    return null;
  }
}
