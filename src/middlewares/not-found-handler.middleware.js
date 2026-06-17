
import { StatusCodes } from "http-status-codes";

export const notFoundHandler = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
