const mongoose = require("mongoose");

const FontsSchema = new mongoose.Schema({
  font: {
    type: String,
    required: true,
  },
  subfamilies: [
    {
      subfont: {
        type: String,
        required: true,
      },
      isActive: {
        type: String,
        required: true,
        default: false,
      },
    },
  ],
  isActive: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = Fonts = mongoose.model("fonts", FontsSchema);
