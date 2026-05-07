const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const env = require("../config/env");
const AppError = require("../utils/AppError");

const ANALYZE_TIMEOUT_MS = 240000;

const getPythonApi = () =>
  axios.create({
    baseURL: env.pythonServiceUrl,
    timeout: ANALYZE_TIMEOUT_MS,
  });

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
      const upstreamStatus = error.response?.status;
      const upstreamMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message;

      throw new AppError(
        `Python analysis failed${upstreamStatus ? ` (${upstreamStatus})` : ""}: ${upstreamMessage}`,
        502
      );
    }

    throw error;
  }
};

const compareAudio = async (userFilePath, originalFilePath) => {
  // Run sequentially to avoid overloading Python service with concurrent analyses.
  const userAnalysis = await analyzeAudio(userFilePath);
  const originalAnalysis = await analyzeAudio(originalFilePath);
  return [userAnalysis, originalAnalysis];
};

module.exports = {
  analyzeAudio,
  compareAudio,
};