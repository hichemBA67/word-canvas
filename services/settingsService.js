const Settings = require("../models/Settings");
const {
  MIN_FONTSIZE,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDING,
  LINESPACE,
  WORDSPACE,
} = require("../constants/index");

async function getSettings(settingsId) {
  let settings;
  if (settingsId) {
    settings = await Settings.findById(settingsId);
  } else {
    settings = await Settings.findOne({ default: true });
  }

  if (!settings) {
    settings = await Settings.findOne({ name: "default" });
  }

  const settingsField = {};
  settingsField.minFontSize = settings.minFontSize || MIN_FONTSIZE;
  settingsField.maxFontSize = settings.maxFontSize || MAX_FONTSIZE;
  settingsField.canvasHeight = settings.canvasHeight || CANVAS_HEIGHT;
  settingsField.canvasWidth = settings.canvasWidth || CANVAS_WIDTH;
  settingsField.linespace = settings.lineSpace || LINESPACE;
  settingsField.wordSpace = settings.wordSpace || WORDSPACE;
  settingsField.padding = settings.padding || PADDING;
  settingsField.id = settings._id || null;

  return settings;
}

module.exports = {
  getSettings,
};
