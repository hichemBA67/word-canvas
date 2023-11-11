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

const setDefault = async (req, res) => {
  try {
    let newDefaultSettings = await Settings.findById(req.params.settingsId);
    if (!newDefaultSettings) {
      return res
        .status(404)
        .json(`Settings with id ${req.params.settingsId} not found.`);
    }

    let oldDefaultSettings = await Settings.findOne({ default: true });
    if (oldDefaultSettings) {
      oldDefaultSettings = await Settings.findOneAndUpdate(
        { default: true },
        {
          $set: { default: false },
        },
        { new: true }
      );

      await oldDefaultSettings.save();
    }

    newDefaultSettings = await Settings.findOneAndUpdate(
      { _id: req.params.settingsId },
      {
        $set: { default: true },
      },
      { new: true }
    );

    await newDefaultSettings.save();

    return res
      .status(200)
      .json(
        `Settings (_id: ${req.params.settingsId}) successfully set to default.`
      );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const deleteSettings = async (req, res) => {
  try {
    await Settings.deleteOne({ _id: req.params.settingsId });

    return res
      .status(200)
      .json(`Settings (_id: ${req.params.settingsId}) deleted successfully.`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
  setDefault,
  deleteSettings,
};
