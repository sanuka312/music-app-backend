const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const env = require("../config/env");
const AppError = require("../utils/AppError");

const ANALYZE_TIMEOUT_MS = 240000;
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

const getPythonApi = () =>
  axios.create({
    baseURL: getPythonBaseUrl(),
    timeout: ANALYZE_TIMEOUT_MS,
  });

const warmUpPythonService = async () => {
  const pythonApi = getPythonApi();

  try {
    await pythonApi.get("/health", {
      timeout: 20000,
    });
  } catch (err) {
    // Don't hard-fail warmup; analysis call may still work.
    console.warn("Python warm-up ping failed:", err.message);
  }
};

const analyzeAudio = async (filePath) => {
  const pythonApi = getPythonApi();
  const formData = new FormData();

  formData.append("file", fs.createReadStream(filePath));

  try {
    const response = await pythonApi.post("/analyze", formData, {
      headers: { ...formData.getHeaders(), "Content-Type": "multipart/form-data" },
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