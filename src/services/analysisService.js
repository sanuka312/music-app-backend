const { analyzeAudio } = require("./pythonService");
const path = require("path");

const NOTE_INDEX = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11,
};

const getKeyRoot = (scale = "") => {
  return scale.split(" ")[0];
};

const calculateKeyDifference = (userScale, originalScale) => {
  const userKey = getKeyRoot(userScale);
  const originalKey = getKeyRoot(originalScale);

  if (!(userKey in NOTE_INDEX) || !(originalKey in NOTE_INDEX)) {
    return null;
  }

  return NOTE_INDEX[originalKey] - NOTE_INDEX[userKey];
};

const analyzeRecording = async (filePath) => {
  const absolutePath = path.resolve(filePath);
  return await analyzeAudio(absolutePath);
};

const compareRecordings = async (userFilePath, originalFilePath) => {

  const userAbsolutePath = path.resolve(userFilePath);
  const originalAbsolutePath = path.resolve(originalFilePath);

  const userAnalysis = await analyzeAudio(userAbsolutePath);
  const originalAnalysis = await analyzeAudio(originalAbsolutePath);

  const pitchSemitoneDifference =
    originalAnalysis.midiNote - userAnalysis.midiNote;

  const keySemitoneDifference = calculateKeyDifference(
    userAnalysis.scale,
    originalAnalysis.scale
  );

  let recommendation = "You are singing in the correct key";
  if (keySemitoneDifference !== null) {
    if (keySemitoneDifference > 0) {
      recommendation = `Sing ${Math.abs(keySemitoneDifference)} semitones higher`;
    } else if (keySemitoneDifference < 0) {
      recommendation = `Sing ${Math.abs(keySemitoneDifference)} semitones lower`;
    }
  }

  // let recommendation = "You are singing in the correct pitch";

  // if (pitchSemitoneDifference > 0) {
  //   recommendation = `Sing ${pitchSemitoneDifference} semitones higher`;
  // } else if (pitchSemitoneDifference < 0) {
  //   recommendation = `Sing ${Math.abs(pitchSemitoneDifference)} semitones lower`;
  // }

  return {
    userAnalysis,
    originalAnalysis,
    pitchSemitoneDifference,
    keySemitoneDifference,
    semitoneDifference: pitchSemitoneDifference,
    recommendation,
  };
};

module.exports = {
  analyzeRecording,
  compareRecordings,
};