import crypto from "node:crypto";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

/**
 * Hash a plain-text password using bcrypt (per-user random salt, 12 rounds).
 * Replaces the previous insecure pbkdf2Sync with hardcoded "salt" string.
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Timing-safe comparison of a plain-text password against a bcrypt hash.
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a cryptographically secure random hex token.
 * @param {number} bytes - Number of random bytes (output length = bytes * 2)
 */
export function generateRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Generate a secure token suitable for use as a refresh token or reset token.
 * Returns both the raw token (to send to client) and its SHA-256 hash (to store in DB).
 */
export function generateTokenPair() {
  const raw = generateRandomToken(32);
  const hashed = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hashed };
}
