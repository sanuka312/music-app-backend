const express = require("express");
const { analyzeUpload } = require("../controllers/analysisController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/", upload.single("audio"), analyzeUpload);

module.exports = router;
