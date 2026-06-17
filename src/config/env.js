import "dotenv/config";
import { z } from "zod";

// Preprocess: convert empty strings to undefined so defaults apply
const processedEnv = Object.entries(process.env).reduce((acc, [key, value]) => {
  acc[key] = value === "" ? undefined : value;
  return acc;
}, {});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().optional().pipe(z.coerce.number().int().positive()).default(3000),
  CORS_ORIGIN: z.string().url().default("http://localhost:3000"),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .optional()
    .pipe(z.coerce.number().int().positive())
    .default("900000"),
  RATE_LIMIT_MAX: z.string().optional().pipe(z.coerce.number().int().positive()).default("100"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "trace", "fatal"]).default("info"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
});

let env;

try {
  env = envSchema.parse(processedEnv);
} catch (error) {
  if (error instanceof z.ZodError) {
    const formattedErrors = error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join("\n");
    throw new Error(`Environment validation error(s):\n${formattedErrors}`);
  }
  throw error;
}

export default env;
export { env };
