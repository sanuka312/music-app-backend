const axios = require("axios");
const env = require("../config/env");

const analyzeAudio = async (filePath) => {
  const response = await axios.post(`${env.pythonServiceUrl}/analyze`, {
    filePath,
  });

  return response.data;
};

module.exports = {
  analyzeAudio,
};