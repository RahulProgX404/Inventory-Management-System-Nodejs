import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import env from "../config/env.js";
import { AppError } from "../utils/app-error.js";

export function verifyJWT(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("Unauthorized: No token provided", StatusCodes.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError("Unauthorized: Invalid token", StatusCodes.UNAUTHORIZED);
  }
}

export function signJWT(payload, expiresIn = "7d") {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}
