import winston from "winston";
import env from "./env.js";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ timestamp, level, message, stack, ...meta }) => {
  const msg = stack || message;
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${timestamp} ${level}: ${msg}${metaStr}`;
});

const logger = winston.createLogger({
  level: env.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true }), colorize({ all: true }), logFormat),
  transports: [new winston.transports.Console()],
});

export default logger;
export { logger };
