const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const uploadRoutes = require("./routes/uploadRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api/uploads", uploadRoutes);
app.use("/api/analysis", analysisRoutes);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Not found: ${req.originalUrl}`,
  });
});

module.exports = app;