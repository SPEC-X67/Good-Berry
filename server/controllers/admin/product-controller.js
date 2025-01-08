const Variant = require('../../models/Variant');
const Product = require('../../models/Product');
const Category = require('../../models/Categorys');
const { default: mongoose } = require('mongoose');

// Add product handler
const addProduct = async (req, res) => {
  const { name, description, isFeatured, category, variants } = req.body;
  try {
    // Validate input
    if (!name || !description || !category) {
      return res.json({ message: "Name, description, and category are required." });
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res.json({ message: "At least one variant is required." });
    }

    // Create the product
    const newProduct = new Product({ name, description, isFeatured, category });
    const savedProduct = await newProduct.save();

    // Create variants for the product
    const savedVariants = await Promise.all(
      variants.map(async (variant) => {

        const newVariant = new Variant({
          productId: savedProduct._id,
          title: variant.title,
          salePrice: variant.salePrice,
          price: variant.price,
          description: variant.description,
          images: variant.images,
          availableQuantity: variant.availableQuantity,
          selectedPackSizes: variant.selectedPackSizes,
        });

        return await newVariant.save();
      })
    );

    res.status(201).json({
      success: true,
      message: "Product and variants added successfully",
      product: savedProduct,
      variants: savedVariants,
    });
  } catch (error) {
    console.error("Error adding product and variants:", error);
    res.status(500).json({ message: "Failed to add product and variants", error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    const productsWithVariants = await Promise.all(
      products.map(async (product) => {

        const category = await Category.findOne({ _id: product.category });
        if (!category) {
          return {
            ...product._doc,
            category: { name: "Unknown", status: "Unknown" },
            variants: [],
          };
        }
        const variants = await Variant.find({ productId: product._id });

        return {
          ...product._doc, 
          category: {name: category.name, status: category.status},
          variants,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products: productsWithVariants,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};


// Get a single product with its variants
const getProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const variants = await Variant.find({ productId: productId });
    
    res.json({
      success: true,
      message: 'Product fetched successfully',
      product,
      variants,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

// Update a product and its variants
const updateProduct = async (req, res) => {
 // Edit Product Controller
  const { id } = req.params;
  console.log(id);
  const { name, description, isFeatured, category, variants } = req.body;
  
  try {
    // Validate input
    if (!name || !description || !category) {
      return res.json({ message: "Name, description, and category are required." });
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res.json({ message: "At least one variant is required." });
    }

            if (!mongoose.Types.ObjectId.isValid(id)) {
              return res.status(400).json({ message: "Invalid product id",id });
          }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, isFeatured, category },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete existing variants
    await Variant.deleteMany({ productId: id });

    // Create new variants
    const updatedVariants = await Promise.all(
      variants.map(async (variant) => {
        const newVariant = new Variant({
          productId: updatedProduct._id,
          title: variant.title,
          salePrice: variant.salePrice,
          price: variant.price,
          description: variant.description,
          images: variant.images,
          availableQuantity: variant.availableQuantity,
          selectedPackSizes: variant.selectedPackSizes,
        });

        return await newVariant.save();
      })
    );

    res.json({
      success: true,
      message: "Product and variants updated successfully",
      product: updatedProduct,
      variants: updatedVariants,
    });
  } catch (error) {
    console.error("Error updating product and variants:", error);
    res.status(500).json({ message: "Failed to update product and variants", error: error.message });
  }
};

// Delete a product (soft delete)
const unListProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }


        const list = !product.unListed;
        console.log(list);

        const data = await Product.findByIdAndUpdate(productId, { unListed: list });
        res.status(200).json({ success: true, message: "Product unlisted successfully", productId, data });
    } catch (error) {
        console.error("Error unlisting product:", error);
        res.status(500).json({ success: false, message: "Failed to unlist product", error: error.message });
    }
}

module.exports = {
    addProduct,
    getAllProducts,
    getProduct,
    updateProduct,  
    unListProduct
}