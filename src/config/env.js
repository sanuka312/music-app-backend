const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "",
  pythonServiceUrl: (process.env.PYTHON_SERVICE_URL || "http://localhost:8000").trim(),
};
