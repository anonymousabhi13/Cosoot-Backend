const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
// mongoose.connect('mongodb://0.0.0.0:27017/crud_db');
mongoose
  .connect("mongodb://0.0.0.0:27017/crud_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const Product = require("./module/Product");
const Process = require("./module/Process");
// Middleware
app.use(bodyParser.json());

// API Endpoints

// Create Product
app.post("/products", async (req, res) => {
  // res.send("helo");
  try {
    const { creation_timestamp, quantity } = req.body;
    console.log(creation_timestamp, quantity);
    const product = await Product.create({ creation_timestamp, quantity });
    res.json({
      product_id: product._id,
      timestamp: creation_timestamp,
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/products", async (req, res) => {
  res.send("helo");
});

// Create Process
app.post("/processes", async (req, res) => {
  try {
    const { product_id, process_identifier, inputs, outputs } = req.body;
    const process = await Process.create({
      product_id,
      process_identifier,
      inputs,
      outputs,
    });
    res.json({
      process_id: process._id,
      message: "Process created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Associate Processes with Product
// app.post("/products/:product_id/associate-processes", async (req, res) => {
//     try {
//       const { product_id } = req.params;
//       const { process_ids } = req.body;

//       await Product.findByIdAndUpdate(product_id, { $push: { processes: process_ids } });
//       res.json({ message: 'Processes associated with the product successfully',processes:Product });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }

// });

// Compute TTV for a Product
app.get("/products/:product_id/compute-ttv", async (req, res) => {
  try {
    const productId = req.params.productId;

    // Fetch processes for the product
    const product = await Product.findById(productId).populate("processes");

    let TTV = 0;
    for (const process of product.processes) {
      // Compute TTV for each process
      const netTokenValue =
        process.output.token_value -
        process.input_ids.reduce((acc, curr) => acc + curr.token_value, 0);
      TTV += netTokenValue;
    }

    res.json({ TTV });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
