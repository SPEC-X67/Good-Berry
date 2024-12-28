const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    sku: String,
    price: String,
    stock: String,
    category: String,
  });
  
  const categorySchema = new mongoose.Schema({
    name: String,
    status: String,
  });
  
  const Category = mongoose.model("Category", categorySchema);
  const Product = mongoose.model("Product", productSchema);
  
  module.exports = { Product, Category };