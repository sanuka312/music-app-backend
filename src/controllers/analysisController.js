const { analyzeRecording, compareRecordings } = require("../services/analysisService");
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
      userAnalysis: {
        pitch: analysis.pitch,
        note: analysis.note,
        midiNote: analysis.midiNote,
        scale: analysis.scale,
        confidence: analysis.confidence,
        tempo: analysis.tempo,
        notes: analysis.notes,
      },
      userFileName: req.file.originalname,
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

const compareUploads = async (req, res, next) => {
  try {
    const userAudio = req.files?.userAudio?.[0];
    const originalAudio = req.files?.originalAudio?.[0];

    if (!userAudio || !originalAudio) {
      return res.status(400).json({
        success: false,
        message:
          "Two audio files are required: userAudio and originalAudio (multipart/form-data).",
      });
    }

    const comparison = await compareRecordings(
      userAudio.path,
      originalAudio.path
    );

    const analysisResult = await AnalysisResult.create({
      userAnalysis: comparison.userAnalysis,
      originalAnalysis: comparison.originalAnalysis,

      pitchSemitoneDifference: comparison.pitchSemitoneDifference,
      keySemitoneDifference: comparison.keySemitoneDifference,
      semitoneDifference: comparison.semitoneDifference,

      recommendation: comparison.recommendation,

      userFileName: userAudio.originalname,
      originalFileName: originalAudio.originalname,
    });

    return res.status(200).json({
      success: true,
      message: "Audio comparison completed successfully",
      data: analysisResult,
    });
  } catch (error) {
    return next(error);
  }
};

const getAnalysisHistory = async (req, res, next) => {
  try {
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 50, 1),
      200
    );

    const history = await AnalysisResult.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      message: "Analysis history retrieved",
      data: history,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  analyzeUpload,
  compareUploads,
  getAnalysisHistory,
};