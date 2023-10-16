const mongoose = require("mongoose");

const WordsSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
    default: 1,
  },
});

module.exports = Words = mongoose.model("words", WordsSchema);
