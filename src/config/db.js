const mongoose = require("mongoose");
const env = require("./env");
const logger = require("./logger");

const connectDB = async () => {
  if (!env.mongoUri) {
    logger.warn("MONGO_URI is not set. Skipping MongoDB connection.");
    return;
  }

  await mongoose.connect(env.mongoUri);
  logger.info("MongoDB connected");
};

module.exports = connectDB;
