const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./config/logger");
const { ensureUploadDirs } = require("./services/fileService");

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  try {
    await ensureUploadDirs();
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

bootstrap();