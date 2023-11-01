const mongoose = require("mongoose");

const CanvasSchema = new mongoose.Schema({
  filename: String,
  userInput: [
    {
      word: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = Canvas = mongoose.model("canvas", CanvasSchema);
