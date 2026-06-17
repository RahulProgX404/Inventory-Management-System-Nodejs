import http from "node:http";

import env from "./config/env.js";
import { createApp } from "./http/app.js";
import logger from "./config/logger.js";
import { connectDatabase } from "./config/database.js";

async function startServer() {
  const app = createApp();
  const server = http.createServer(app);

  await connectDatabase();

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT, environment: env.NODE_ENV, message: "HTTP server started" });
  });

  const shutdown = (signal) => {
    logger.info({ signal, message: "Shutting down HTTP server" });

    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  return server;
}

startServer();
