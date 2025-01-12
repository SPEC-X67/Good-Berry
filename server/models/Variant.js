const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  images: [String],
  availableQuantity: Number,
  selectedPackSizes: [String],
  packSizePricing: [{
    size: String,
    price: Number,
    salePrice: Number
  }]
});

module.exports = mongoose.model("Variant", variantSchema);
