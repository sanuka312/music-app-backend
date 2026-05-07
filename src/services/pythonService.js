const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const env = require("../config/env");

const ANALYZE_TIMEOUT_MS = 180000;
const WARMUP_TIMEOUT_MS = 10000;

const warmUpPythonService = async () => {
  try {
    await axios.get(`${env.pythonServiceUrl}/health`, {
      timeout: WARMUP_TIMEOUT_MS,
    });
    return;
  } catch (healthError) {
    // Some deployments may not expose /health; fall back to root ping.
  }

  try {
    await axios.get(`${env.pythonServiceUrl}/`, {
      timeout: WARMUP_TIMEOUT_MS,
    });
  } catch (rootError) {
    // Ignore warm-up failures and let /analyze surface the real error.
  }
};

const analyzeAudio = async (filePath) => {
  await warmUpPythonService();

  const formData = new FormData();

  formData.append("file", fs.createReadStream(filePath));

  const response = await axios.post(
    `${env.pythonServiceUrl}/analyze`,
    formData,
    {
      headers: formData.getHeaders(),
      timeout: ANALYZE_TIMEOUT_MS,
    }
  );

  return response.data;
};

module.exports = {
  analyzeAudio,
};