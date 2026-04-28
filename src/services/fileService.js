const fs = require("fs/promises");
const path = require("path");

const ensureUploadDirs = async () => {
  const tempDir = path.join(process.cwd(), "uploads", "temp");
  await fs.mkdir(tempDir, { recursive: true });
  return tempDir;
};

module.exports = {
  ensureUploadDirs,
};
