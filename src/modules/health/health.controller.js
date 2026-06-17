import { StatusCodes } from "http-status-codes";

import env from "../../config/env.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const healthCheck = asyncHandler((_req, res) => {
  res.success(
    {
      status: "healthy",
      environment: env.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    "Server is running",
    StatusCodes.OK
  );
});
