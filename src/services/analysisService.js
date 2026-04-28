const { analyzeAudio } = require("./pythonService");

const analyzeRecording = async (filePath) => {
  const result = await analyzeAudio(filePath);
  return result;
};

module.exports = {
  analyzeRecording,
};