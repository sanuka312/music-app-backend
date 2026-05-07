const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const env = require("../config/env");
const AppError = require("../utils/AppError");

const ANALYZE_TIMEOUT_MS = 180000;
const WARMUP_TIMEOUT_MS = 10000;
const PYTHON_UNAVAILABLE_STATUS = 502;

const getPythonBaseUrl = () => {
  const baseUrl = String(env.pythonServiceUrl || "").trim();

  if (!baseUrl) {
    throw new AppError(
      "PYTHON_SERVICE_URL is missing. Set it to your Python API URL.",
      PYTHON_UNAVAILABLE_STATUS
    );
  }

  if (env.nodeEnv === "production" && /localhost|127\.0\.0\.1/.test(baseUrl)) {
    throw new AppError(
      "Invalid PYTHON_SERVICE_URL for production. Do not use localhost on Render.",
      PYTHON_UNAVAILABLE_STATUS
    );
  }

  return baseUrl;
};

const toPythonEndpoint = (path) => {
  return new URL(path, getPythonBaseUrl()).toString();
};

const warmUpPythonService = async () => {
  try {
    await axios.get(toPythonEndpoint("/health"), {
      timeout: WARMUP_TIMEOUT_MS,
    });
    return;
  } catch (healthError) {
    // Some deployments may not expose /health; fall back to root ping.
  }

  try {
    await axios.get(toPythonEndpoint("/"), {
      timeout: WARMUP_TIMEOUT_MS,
    });
  } catch (rootError) {
    // Ignore warm-up failures and let /analyze surface the real error.
  }
};

const analyzeAudio = async (filePath) => {
  const formData = new FormData();

  formData.append("file", fs.createReadStream(filePath));

  try {
    const response = await axios.post(toPythonEndpoint("/analyze"), formData, {
      headers: formData.getHeaders(),
      timeout: ANALYZE_TIMEOUT_MS,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const details =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message;

      throw new AppError(
        `Python analysis service failed${status ? ` (${status})` : ""}: ${details}`,
        PYTHON_UNAVAILABLE_STATUS
      );
    }

    throw new AppError(
      `Python analysis service failed: ${error.message}`,
      PYTHON_UNAVAILABLE_STATUS
    );
  }
};

const compareAudio = async (userFilePath, originalFilePath) => {
  await warmUpPythonService();
  return Promise.all([analyzeAudio(userFilePath), analyzeAudio(originalFilePath)]);
};

module.exports = {
  analyzeAudio,
  compareAudio,
};