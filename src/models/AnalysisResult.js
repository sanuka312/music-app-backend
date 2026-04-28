const mongoose = require("mongoose");

const analysisResultSchema = new mongoose.Schema(
  {
    recording: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recording",
      required: true,
    },
    pitch: String,
    scale: String,
    confidence: Number,
    tempo: Number,
    notes: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AnalysisResult", analysisResultSchema);