import mongoose from "mongoose";
import env from "./env.js";
import logger from "./logger.js";

async function connectDatabase() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info({ message: "MongoDB connected successfully", mongodbUri: env.MONGODB_URI });

    // Handle connection events
    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("error", (error) => {
      logger.error({ error, message: "MongoDB connection error" });
    });

    return mongoose.connection;
  } catch (error) {
    logger.error({ error: error.message, message: "Failed to connect to MongoDB" });
    throw error;
  }
}

async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected successfully");
  } catch (error) {
    logger.error({ error: error.message, message: "Failed to disconnect from MongoDB" });
    throw error;
  }
}

export { connectDatabase, disconnectDatabase };
