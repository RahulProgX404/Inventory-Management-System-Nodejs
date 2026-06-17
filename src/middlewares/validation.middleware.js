import { z } from "zod";
import { StatusCodes } from "http-status-codes";

import { AppError } from "../utils/app-error.js";


export function validateRequest(schema) {
  return async (req, res, next) => {
    try {
      const body = await schema.parseAsync(req.body);
      req.validatedData = body;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        const errorMsg = formattedErrors.map((e) => `${e.field}: ${e.message}`).join("; ");
        throw new AppError(errorMsg, StatusCodes.BAD_REQUEST);
      }
      throw error;
    }
  };
}
