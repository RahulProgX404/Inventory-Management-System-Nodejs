import { StatusCodes } from "http-status-codes";

import env from "../config/env.js";
import { AppError } from "../utils/app-error.js";
import logger from "../config/logger.js";

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  logger.error({ err: error, message: "Unhandled request error" });
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message:
      env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
          ? error.message
          : "Unknown error",
  });
};
