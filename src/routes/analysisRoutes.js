const express = require("express");
const { analyzeUpload ,compareUploads} = require("../controllers/analysisController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/", upload.single("audio"), analyzeUpload);

router.post(

    "/compare",
    upload.fields([
        { name: "userAudio", maxCount: 1 },
        { name: "originalAudio", maxCount: 1 },
    ]),
    compareUploads
);


module.exports = router;
