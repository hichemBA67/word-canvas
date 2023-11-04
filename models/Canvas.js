const mongoose = require("mongoose");

const CanvasSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  userInput: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  accepted: {
    type: Boolean,
    default: false,
  },
});

module.exports = Canvas = mongoose.model("canvas", CanvasSchema);
