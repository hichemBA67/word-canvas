const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const Canvas = require("../models/Canvas");
const { OUTPUT_PATH } = require("../constants");

const saveImage = async (canvas, userWords) => {
  const stream = canvas.createPNGStream();
  const steamHash = crypto
    .createHash("sha256")
    .update(userWords + Date.now())
    .digest("hex");
  const outputPath = `${OUTPUT_PATH}/${steamHash}.png`;

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
    filename: steamHash,
    userInput: userWords,
  });

  await newCanvas.save();
};

module.exports = {
  saveImage,
};
