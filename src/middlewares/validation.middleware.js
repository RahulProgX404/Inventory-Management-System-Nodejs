import { z } from "zod";
import { StatusCodes } from "http-status-codes";

export function validateRequest(schema) {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.validatedData = parsed;
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return next({
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          message: "Validation failed",
          errors: formattedErrors,
          isValidationError: true,
        });
      }
      return next(error);
    }
  };
}
