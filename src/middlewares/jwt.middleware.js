import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/app-error.js";
import { verifyJwtToken } from "../utils/jwt.js";

export function verifyJWT(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("Unauthorized: No token provided", StatusCodes.UNAUTHORIZED);
  }

  try {
    const decoded = verifyJwtToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError("Unauthorized: Invalid token", StatusCodes.UNAUTHORIZED);
  }
}
