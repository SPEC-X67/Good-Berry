const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  unListed: { type: Boolean, default: false },
},
{ timestamps: true });

module.exports = mongoose.model("Product", productSchema);
