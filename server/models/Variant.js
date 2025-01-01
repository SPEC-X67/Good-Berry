const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  description: { type: String },
  images: { type: [String], default: [] },
  availableQuantity: { type: Number, required: true },
  selectedPackSizes: { type: [String], default: [] },
});

module.exports = mongoose.model("Variant", variantSchema);
