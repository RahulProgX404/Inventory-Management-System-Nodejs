import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/app-error.js";
import { verifyJwtToken } from "../utils/jwt.js";

export function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return next(new AppError("Unauthorized: No token provided", StatusCodes.UNAUTHORIZED));

    const token = authHeader.slice(7);
    const decoded = verifyJwtToken(token);

    if (decoded.tokenType !== "access")
      return next(new AppError("Unauthorized: Invalid token type", StatusCodes.UNAUTHORIZED));

    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return next(new AppError("Unauthorized: Token ahs expired", StatusCodes.UNAUTHORIZED));

    if (error.name === "JsonWebTokenError")
      return next(new AppError("Unauthorized: Invalid token", StatusCodes.UNAUTHORIZED));

    return next(new AppError("Unauthorized: Token verification failed", StatusCodes.UNAUTHORIZED));
  }
}
