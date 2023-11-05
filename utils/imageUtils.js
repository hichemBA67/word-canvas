const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const Canvas = require("../models/Canvas");
const { OUTPUT_PATH } = require("../constants");

const saveImage = async (canvas, userWords) => {
  const stream = canvas.createPNGStream();
  const streamHash = crypto
    .createHash("sha256")
    .update(userWords + Date.now())
    .digest("hex");
  const outputPath = `${OUTPUT_PATH}/${streamHash}.png`;

  // Get directory without the filename
  const dirPath = path.dirname(outputPath);

  // Check if directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const out = fs.createWriteStream(outputPath);
  stream.pipe(out);
  out.on("finish", () => {
    console.log(`The PNG file was created at ${outputPath}`);
  });

  let newCanvas = new Canvas({
    filename: streamHash,
    userInput: userWords,
  });

  await newCanvas.save();

  return streamHash;
};

module.exports = {
  saveImage,
};
