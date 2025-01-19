const mongoose = require("mongoose");
  
  const categorySchema = new mongoose.Schema({
    name: String,
    status: String,
    image: String,
    offerPercentage: { type: Number, default: 0 } // New field for offer percentage
  });
  
  const Category = mongoose.model("Category", categorySchema);
  
  module.exports = Category;