const { analyzeAudio } = require("./pythonService");

const analyzeRecording = async (filePath) => {
  return await analyzeAudio(filePath);
};

const compareRecordings = async (userFilePath, originalFilePath) => {
  const userAnalysis = await analyzeAudio(userFilePath);
  const originalAnalysis = await analyzeAudio(originalFilePath);

  const semitoneDifference = originalAnalysis.midiNote - userAnalysis.midiNote;

  let recommendation = "You are singing in the correct pitch";

  if (semitoneDifference > 0) {
    recommendation = `Sing ${semitoneDifference} semitones higher`;
  } else if (semitoneDifference < 0) {
    recommendation = `Sing ${Math.abs(semitoneDifference)} semitones lower`;
  }

  return {
    userAnalysis,
    originalAnalysis,
    semitoneDifference,
    recommendation,
  };
};

module.exports = {
  analyzeRecording,
  compareRecordings,
};