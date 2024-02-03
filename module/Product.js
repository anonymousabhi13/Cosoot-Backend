const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  creation_timestamp: { type: Date, default: Date.now },
  quantity: Number,
  processes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Process" }],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
