const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const env = require("../config/env");

const analyzeAudio = async (filePath) => {
  const formData = new FormData();

  formData.append("file", fs.createReadStream(filePath));

  const response = await axios.post(
    `${env.pythonServiceUrl}/analyze`,
    formData,
    {
      headers: formData.getHeaders(),
      timeout: 120000,
    }
  );

  return response.data;
};

module.exports = {
  analyzeAudio,
};