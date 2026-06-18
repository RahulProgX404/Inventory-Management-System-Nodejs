import jwt from "jsonwebtoken";
import env from "../config/env.js";

const ACCESS_TOKEN_EXPIRES_IN = env.JWT_EXPIRY;
const REFRESH_TOKEN_EXPIRES_IN = env.REFRESH_TOKEN_EXPIRY;
const JWT_OPTIONS = {
  algorithm: "HS256",
  issuer: "Inventory API",
};

function createJwtToken(payload, expiresIn, options = {}) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn,
    ...JWT_OPTIONS,
    ...options,
  });
}

export function createAccessToken(payload) {
  return createJwtToken(
    {
      ...payload,
      tokenType: "access",
    },
    ACCESS_TOKEN_EXPIRES_IN,
    {
      subject: String(payload.userId),
    }
  );
}

export function createRefreshToken(payload) {
  return createJwtToken(
    {
      ...payload,
      tokenType: "refresh",
    },
    REFRESH_TOKEN_EXPIRES_IN,
    {
      subject: String(payload.userId),
    }
  );
}

export function verifyJwtToken(token) {
  return jwt.verify(token, env.JWT_SECRET, JWT_OPTIONS);
}
