import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";

import env from "../config/env.js";
import logger from "../config/logger.js";
import { router } from "./route.js";
import { requestIdMiddleware } from "../middlewares/request-id.middleware.js";
import { responseHandler } from "../middlewares/response-handler.middleware.js";
import { notFoundHandler } from "../middlewares/not-found-handler.middleware.js";
import { errorHandler } from "../middlewares/error-handler.middleware.js";

export function createApp() {
  const app = express();

  // SECURITY: Disable x-powered-by header
  app.disable("x-powered-by");

  // MIDDLEWARE: Security headers
  app.use(helmet());

  // MIDDLEWARE: CORS
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  // MIDDLEWARE: Request ID (must be early)
  app.use(requestIdMiddleware);

  // MIDDLEWARE: HTTP request logging
  app.use(
    morgan(":method :url :status :response-time ms", {
      stream: {
        write: (msg) => logger.info(msg.trim()),
      },
    })
  );

  // MIDDLEWARE: Rate limiting (global)
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      message: "Too many requests from this IP",
    })
  );

  // MIDDLEWARE: Compression
  app.use(compression());

  // MIDDLEWARE: Body parsing
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // MIDDLEWARE: Rate limiting (API-specific)
  app.use(
    "/api",
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      limit: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  // MIDDLEWARE: Cookie parser
  app.use(cookieParser());

  // MIDDLEWARE: Response handler (add success/error methods)
  app.use(responseHandler);

  // ROUTES
  app.use("/api", router);

  // ERROR HANDLING
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
