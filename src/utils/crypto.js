import crypto from "node:crypto";

export function hashPassword(password) {
  return crypto
    .pbkdf2Sync(password, "salt", 1000, 64, "sha512")
    .toString("hex");
}

export function comparePassword(password, hash) {
  const newHash = crypto
    .pbkdf2Sync(password, "salt", 1000, 64, "sha512")
    .toString("hex");
  return newHash === hash;
}

export function generateRandomToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}
