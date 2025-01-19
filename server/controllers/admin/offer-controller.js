const Category = require('../../models/Categorys.js');
const Product = require('../../models/Product');
const Variant = require('../../models/Variant');

// Add Offer to Category
const addCategoryOffer = async (req, res) => {
  try {
    const { categoryId, offerPercentage } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.offerPercentage = offerPercentage;
    await category.save();

    // Update sale prices for all variants in this category
    const products = await Product.find({ category: categoryId });
    await Promise.all(products.map(async (product) => {
      const variants = await Variant.find({ productId: product._id });
      await Promise.all(variants.map(async (variant) => {
        const productOffer = product.offerPercentage || 0;
        const categoryOffer = category.offerPercentage || 0;
        const bestOffer = Math.max(productOffer, categoryOffer);

        variant.packSizePricing = variant.packSizePricing.map(pack => {
          const discount = (pack.price * bestOffer) / 100;
          pack.salePrice = pack.price - discount;
          return pack;
        });

        await variant.save();
      }));
    }));

    res.status(200).json({ success: true, message: 'Offer added successfully' });
  } catch (error) {
    console.error('Error adding offer:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add offer', error: error.message });
  }
};

// Remove Offer from Category
const removeCategoryOffer = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.offerPercentage = 0;
    await category.save();

    // Update sale prices for all variants in this category
    const products = await Product.find({ category: categoryId });
    await Promise.all(products.map(async (product) => {
      const variants = await Variant.find({ productId: product._id });
      await Promise.all(variants.map(async (variant) => {
        const productOffer = product.offerPercentage || 0;
        const categoryOffer = category.offerPercentage || 0;
        const bestOffer = Math.max(productOffer, categoryOffer);

        variant.packSizePricing = variant.packSizePricing.map(pack => {
          const discount = (pack.price * bestOffer) / 100;
          pack.salePrice = pack.price - discount;
          return pack;
        });

        await variant.save();
      }));
    }));

    res.status(200).json({ success: true, message: 'Offer removed successfully' });
  } catch (error) {
    console.error('Error removing offer:', error.message);
    res.status(500).json({ success: false, message: 'Failed to remove offer', error: error.message });
  }
};

const addProductOffer = async (req, res) => {
  const { id } = req.params;
  const { offerPercentage } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { offerPercentage },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Update sale prices for all variants of this product
    const variants = await Variant.find({ productId: id });
    await Promise.all(variants.map(async (variant) => {
      const productOffer = product.offerPercentage || 0;
      const categoryOffer = product.category.offerPercentage || 0;
      const bestOffer = Math.max(productOffer, categoryOffer);

      variant.packSizePricing = variant.packSizePricing.map(pack => {
        const discount = (pack.price * bestOffer) / 100;
        pack.salePrice = pack.price - discount;
        return pack;
      });

      await variant.save();
    }));

    res.status(200).json({ success: true, message: "Offer added successfully", product });
  } catch (error) {
    console.error("Error adding offer:", error);
    res.status(500).json({ success: false, message: "Failed to add offer", error: error.message });
  }
};

const removeProductOffer = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { offerPercentage: 0 },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Update sale prices for all variants of this product
    const variants = await Variant.find({ productId: id });
    await Promise.all(variants.map(async (variant) => {
      const productOffer = product.offerPercentage || 0;
      const categoryOffer = product.category.offerPercentage || 0;
      const bestOffer = Math.max(productOffer, categoryOffer);

      variant.packSizePricing = variant.packSizePricing.map(pack => {
        const discount = (pack.price * bestOffer) / 100;
        pack.salePrice = pack.price - discount;
        return pack;
      });

      await variant.save();
    }));

    res.status(200).json({ success: true, message: "Offer removed successfully", product });
  } catch (error) {
    console.error("Error removing offer:", error);
    res.status(500).json({ success: false, message: "Failed to remove offer", error: error.message });
  }
};

module.exports = {
  addCategoryOffer,
  removeCategoryOffer,
  addProductOffer,
  removeProductOffer
};
