const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  minFontSize: {
    type: Number,
    required: true,
  },
  maxFontSize: {
    type: Number,
    required: true,
  },
  lineSpace: {
    type: Number,
    required: true,
  },
  wordSpace: {
    type: Number,
    required: true,
  },
  canvasHeight: {
    type: Number,
    required: true,
  },
  canvasWidth: {
    type: Number,
    required: true,
  },
  padding: {
    type: Number,
    required: true,
  },
  default: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = Settings = mongoose.model("settings", SettingsSchema);
