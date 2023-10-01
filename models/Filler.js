const mongoose = require("mongoose");

const FillerSchema = new mongoose.Schema({
  filler: {
    type: String,
    required: true,
  },
});

module.exports = Filler = mongoose.model("filler", FillerSchema);
