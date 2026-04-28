const { sendSuccess } = require("../utils/apiResponse");

const getHealth = (req, res) => {
  return sendSuccess(
    res,
    {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    "Health check passed"
  );
};

module.exports = {
  getHealth,
};
