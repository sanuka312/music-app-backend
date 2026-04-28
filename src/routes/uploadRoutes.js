const express = require("express");
const upload = require("../middlewares/uploadMiddleware");

console.log("uploadRoutes loaded");

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("Upload route working");
});

router.post("/audio", upload.single("audio"), (req, res) => {
    console.log(req.file);

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        });
    }

    res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        data: req.file,
    });
});

module.exports = router;