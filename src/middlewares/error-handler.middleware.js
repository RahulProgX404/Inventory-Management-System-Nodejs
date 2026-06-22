import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

import env from "../config/env.js";
import { AppError } from "../utils/app-error.js";
import logger from "../config/logger.js";
import { formatErrorResponse } from "../utils/helper.js";

export const errorHandler = (error, req, res, _next) => {
  // Structured validation errors from validateRequest middleware
  if (error.isValidationError) {
    return res.status(error.statusCode).json(formatErrorResponse(req, error.message, error));
  }

  // Known operational errors (AppError)
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(formatErrorResponse(req, error.message));
  }

  // Mongoose validation error
  if (error instanceof mongoose.Error.ValidationError) {
    const message = Object.values(error.errors)
      .map((e) => e.message)
      .join("; ");

    return res.status(StatusCodes.BAD_REQUEST).json(formatErrorResponse(req, message));
  }

  // Mongoose CastError (invalid ObjectId that slipped past validateObjectId)
  if (error instanceof mongoose.Error.CastError) {
    return res.status(StatusCodes.BAD_REQUEST).json(req, "Invalid resource identifier");
  }

  // Multer errors
  if (error.name === "MulterError") {
    return res.status(StatusCodes.BAD_REQUEST).json(formatErrorResponse(req, error.message));
  }

  // Unknown errors - log full detail, return generic message in production
  logger.error({ err: error, message: "Unhandled  error" });
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(
      formatErrorResponse(
        req,
        env.NODE_ENV === "production"
          ? "Internal server error"
          : error instanceof Error
            ? error.message
            : "Unknown error"
      )
    );
};
