const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/apiResponse");
const Recording = require("../models/Recording");

const uploadRecording = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError("No audio file uploaded", 400));
    }

    const recording = await Recording.create({
      fileName: req.file.filename,
      filePath: req.file.path,
      fileUrl: `/uploads/temp/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
      status: "pending",
    });

    return sendSuccess(
      res,
      recording,
      "Recording uploaded successfully",
      201
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  uploadRecording,
};
