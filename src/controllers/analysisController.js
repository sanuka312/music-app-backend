const { analyzeRecording } = require("../services/analysisService");
const Recording = require("../models/Recording");
const AnalysisResult = require("../models/AnalysisResult");

const analyzeUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No audio file uploaded",
      });
    }

    const recording = await Recording.create({
      fileName: req.file.filename,
      filePath: req.file.path,
      fileUrl: `/uploads/temp/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
      status: "pending",
    });

    const analysis = await analyzeRecording(req.file.path);

    const analysisResult = await AnalysisResult.create({
      recording: recording._id,
      pitch: analysis.pitch,
      scale: analysis.scale,
      confidence: analysis.confidence,
      tempo: analysis.tempo,
      notes: analysis.notes,
    });

    recording.status = "completed";
    await recording.save();

    res.status(200).json({
      success: true,
      message: "Audio analyzed successfully",
      data: {
        file: {
          originalName: req.file.originalname,
          fileName: req.file.filename,
          path: req.file.path,
          size: req.file.size,
          mimeType: req.file.mimetype,
        },
        analysis,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeUpload,
};