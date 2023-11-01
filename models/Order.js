const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  filename: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = Order = mongoose.model("order", OrderSchema);
