import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
    statusCode;

   constructor(
    message,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}
