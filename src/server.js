const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");
const logger = require("./config/logger");
const { ensureUploadDirs } = require("./services/fileService");

const bootstrap = async () => {
  try {
    await ensureUploadDirs();
    await connectDB();

    app.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

bootstrap();
