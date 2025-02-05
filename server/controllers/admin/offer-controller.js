const Category = require('../../models/Categorys.js');
const Product = require('../../models/Product');
const Variant = require('../../models/Variant');
const Cart = require('../../models/Cart');

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



    const productIds = products.map(p => p._id);
    const variants = await Variant.find({ productId: { $in: productIds } });

    const variantsByProduct = {};
    variants.forEach(v => {
      const key = v.productId.toString();
      if (!variantsByProduct[key]) variantsByProduct[key] = [];
      variantsByProduct[key].push(v);
    });

    // Update carts
    const carts = await Cart.find({ "items.productId": { $in: productIds } });
    for (const cart of carts) {
      let hasChanges = false;
      cart.items.forEach(item => {
        const productVariants = variantsByProduct[item.productId.toString()] || [];
        const variant = productVariants.find(v => v.title === item.flavor);
        if (variant) {
          const pack = variant.packSizePricing.find(p => p.size === item.packageSize);
          if (pack && (item.salePrice !== pack.salePrice || item.price !== pack.price)) {
            item.price = pack.price;
            item.salePrice = pack.salePrice;
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        await cart.save();
      }
    }

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

    const productIds = products.map(p => p._id);
    const variants = await Variant.find({ productId: { $in: productIds } });

    const variantsByProduct = {};
    variants.forEach(v => {
      const key = v.productId.toString();
      if (!variantsByProduct[key]) variantsByProduct[key] = [];
      variantsByProduct[key].push(v);
    });

    // Update carts
    const carts = await Cart.find({ "items.productId": { $in: productIds } });
    for (const cart of carts) {
      let hasChanges = false;
      cart.items.forEach(item => {
        const productVariants = variantsByProduct[item.productId.toString()] || [];
        const variant = productVariants.find(v => v.title === item.flavor);
        if (variant) {
          const pack = variant.packSizePricing.find(p => p.size === item.packageSize);
          if (pack && (item.salePrice !== pack.salePrice || item.price !== pack.price)) {
            item.price = pack.price;
            item.salePrice = pack.salePrice;
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        await cart.save();
      }
    }
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

    // Update cart items for all users
    const carts = await Cart.find({ "items.productId": id });
    for (const cart of carts) {
      cart.items.forEach(item => {
        if (item.productId.toString() === id) {
          const variant = variants.find(v => v.title === item.flavor);
          if (variant) {
            const pack = variant.packSizePricing.find(p => p.size === item.packageSize);
            if (pack) {
              item.price = pack.price;
              item.salePrice = pack.salePrice;
            }
          }
        }
      });
      await cart.save();
    }

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

    // Update cart items for all users
    const carts = await Cart.find({ "items.productId": id });
    for (const cart of carts) {
      cart.items.forEach(item => {
        if (item.productId.toString() === id) {
          const variant = variants.find(v => v.title === item.flavor);
          if (variant) {
            const pack = variant.packSizePricing.find(p => p.size === item.packageSize);
            if (pack) {
              item.price = pack.price;
              item.salePrice = pack.salePrice;
            }
          }
        }
      });
      await cart.save();
    }

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
