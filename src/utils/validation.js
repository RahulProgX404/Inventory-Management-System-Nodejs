import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { AppError } from "./app-error.js";

export function validateObjectId(paramName) {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid resource identifier", StatusCodes.BAD_REQUEST);
    }
    next();
  };
}
