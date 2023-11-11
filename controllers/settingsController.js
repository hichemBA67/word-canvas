const Settings = require("../models/Settings");
const { validationResult } = require("express-validator");

const getSettings = async (req, res) => {
  const settings = await Settings.find();

  if (settings.length === 0) {
    res.json("No settings found!");
  }

  res.json(settings);
};

const createSettings = async (req, res) => {
  // Check inputs validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    name,
    minFontSize,
    maxFontSize,
    lineSpace,
    wordSpace,
    canvasHeight,
    canvasWidth,
    padding,
  } = req.body;

  let settingsFields = {};
  settingsFields.name = name;
  settingsFields.minFontSize = minFontSize;
  settingsFields.maxFontSize = maxFontSize;
  settingsFields.lineSpace = lineSpace;
  settingsFields.wordSpace = wordSpace;
  settingsFields.canvasHeight = canvasHeight;
  settingsFields.canvasWidth = canvasWidth;
  settingsFields.padding = padding;

  try {
    let setting = await Settings.findOne({ name });
    if (setting) {
      return res.status(400).json(`Settings with name ${name} already exists`);
    }

    const newSettings = new Settings(settingsFields);

    await newSettings.save();
    res.json(newSettings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const updateSettings = async (req, res) => {};

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
