const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   price: {
      type: Number,
      required: true,
   },
   category: {
      type: String,
      required: true,
   },
   packSizes: {
      type: Array,
      required: true,
   },
   image: {
      type: Array,
      required: true,
   },
   flavors: {
      type: Array,
      required: true,
   },
   bestSeller : {
      type: Boolean,
      default: false
   },
   createdAt: {
      type: Date,
      default: Date.now
   },
   stock : {
      type: Number,
      default: 0
   },
   sku: {
     type: String,
     required: true 
   },
   isDeleted : {
      type: Boolean,
      default: false
   }
  });

  const Product = mongoose.model("Product", productSchema);

  module.exports = Product;