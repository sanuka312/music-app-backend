const mongoose = require("mongoose");

const analysisResultSchema = new mongoose.Schema(
  {
    userAnalysis: {
      pitch: String,
      note: String,
      midiNote: Number,
      scale: String,
      confidence: Number,
      tempo: Number,
      notes: [String],
      pitchTimeline: [
        {
          time: Number,
          pitch: Number,
        },
      ],
    },

    originalAnalysis: {
      pitch: String,
      note: String,
      midiNote: Number,
      scale: String,
      confidence: Number,
      tempo: Number,
      notes: [String],
      pitchTimeline: [
        {
          time: Number,
          pitch: Number,
        },
      ],
    },

    pitchSemitoneDifference: Number,
    keySemitoneDifference: Number,
    semitoneDifference: Number,
    recommendation: String,

    userFileName: String,
    originalFileName: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AnalysisResult", analysisResultSchema);