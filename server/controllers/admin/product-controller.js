const Variant = require('../../models/Variant');
const Product = require('../../models/Product');
const Category = require('../../models/Categorys');

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
    const products = await Product.find({ isDeleted: false });

    const productsWithVariants = await Promise.all(
      products.map(async (product) => {

        const category = await Category.findOne({ _id: product.category });
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
    // Fetch the product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch the variants associated with the product
    const variants = await Variant.find({ productId: productId });

    // Send a response including the product and its variants
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
  const productId = req.params.id;
  const { name, description, isFeatured, category, variants } = req.body;

  try {
    // Validate input
    if (!name || !description || !category) {
      return res.status(400).json({ success: false, message: "Name, description, and category are required." });
    }

    // Update the product details
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, isFeatured, category },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Update the variants
    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        if (variant._id) {
          // Update existing variant
          await Variant.findByIdAndUpdate(
            variant._id,
            {
              title: variant.title,
              salePrice: variant.salePrice,
              price: variant.price,
              description: variant.description,
              images: variant.images,
              availableQuantity: variant.availableQuantity,
              selectedPackSizes: variant.selectedPackSizes,
            },
            { new: true }
          );
        } else {
          // Add new variant
          const newVariant = new Variant({
            productId,
            title: variant.title,
            salePrice: variant.salePrice,
            price: variant.price,
            description: variant.description,
            images: variant.images,
            availableQuantity: variant.availableQuantity,
            selectedPackSizes: variant.selectedPackSizes,
          });
          await newVariant.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Product and variants updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product.",
      error: error.message,
    });
  }
};

// Delete a product (soft delete)
const removeProduct = async (req, res) => { 
    try {
        const productId = req.params.id;
        await Product.findByIdAndUpdate(productId, {isDeleted: true});
        res.json({success: true, message: 'Product deleted successfully'});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

module.exports = {
    addProduct,
    getAllProducts,
    getProduct,
    updateProduct,  
    removeProduct
}