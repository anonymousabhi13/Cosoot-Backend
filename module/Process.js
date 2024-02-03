const mongoose = require("mongoose");

const inputOutputSchema = new mongoose.Schema({
  input_output_identifier: String,
  token_value: Number,
  cosoot_value: Number,
});

const processSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  process_identifier: String,
  inputs: [inputOutputSchema],
  outputs: [inputOutputSchema],
});

const Process = mongoose.model("Process", processSchema);

module.exports = Process;
