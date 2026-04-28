const mongoose = require("mongoose");

const recordingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fileName: {
      type: String, required: true,
      unique: true,
    },
    filePath: {
      type: String, required: true,
      unique: true,
    },
    fileUrl: {
      type: String, required: true,
      unique: true,
    },
    mimetype: {
      type: String, required: true,
    },
    size: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending"
    },
    duration: {
      type: Number,
      default: 0
    },
    analysisResults: {
      type: mongoose.Schema.Types.Mixed,
      default: {} 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recording", recordingSchema);
