import winston from "winston";
import env from "./env.js";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const consoleFormat = printf(({ timestamp, level, message, stack, ...meta }) => {
  const msg = stack || message;
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${timestamp} ${level}: ${msg}  ${metaStr}`;
});

const transports = [
  new winston.transports.Console({
    format: combine(timestamp(), errors({ stack: true }), colorize({ all: true }), consoleFormat),
  }),
];

if (env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(timestamp(), errors({ stack: true }), json()),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: combine(timestamp(), errors({ stack: true }), json()),
      maxsize: 10 * 1025 * 1025,
      maxFiles: 5,
    })
  );
}

const logger = winston.createLogger({
  level: env.LOG_LEVEL || "info",
  transports,
  exitOnError: false,
});

export default logger;
export { logger };
