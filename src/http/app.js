import express from "express";
import path from "node:path";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import { StatusCodes } from "http-status-codes";

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

  // MIDDLEWARE: CORS - Allow frontend access
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

  // MIDDLEWARE: Compression
  app.use(compression());

  // MIDDLEWARE: Body parsing
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // MIDDLEWARE: Cookie parser
  app.use(cookieParser());

  // MIDDLEWARE: Response handler (add success/error methods)
  app.use(responseHandler);

  // MIDDLEWARE: Rate limiting — general API traffic
  const apiRateLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        success: false,
        message: "Too many requests. Please try again later.",
        data: null,
        requestId: req.id,
      });
    },
  });

  // MIDDLEWARE: Rate limiting — stricter limit on auth endpoints to slow brute-force attempts
  const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        success: false,
        message: "Too many authentication attempts. Please try again later.",
        data: null,
        requestId: req.id,
      });
    },
  });

  app.use("/api/users/login", authRateLimiter);
  app.use("/api/users/register", authRateLimiter);
  app.use("/api/users/refresh", authRateLimiter);
  app.use("/api", apiRateLimiter);

  // STATIC: Serve uploaded product images
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  // ROUTES
  app.use("/api", router);

  // ERROR HANDLING
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
