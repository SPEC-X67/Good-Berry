const Category = require('../../models/Categorys.js');

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

    res.status(200).json({ success: true, message: 'Offer removed successfully' });
  } catch (error) {
    console.error('Error removing offer:', error.message);
    res.status(500).json({ success: false, message: 'Failed to remove offer', error: error.message });
  }
};

module.exports = {
  addCategoryOffer,
  removeCategoryOffer
};
