const Category = require('../../models/Categorys.js');

// Add Category
const addCategory = async (req, res) => {
  try {
    const { name, status, image, offerPercentage } = req.body;

    const existingCategory = await Category.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });

    if (existingCategory) {
      return res.json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({ name, status, image, offerPercentage });
    return res.status(201).json({ success: true, message: 'Category created successfully', category });

  } catch (error) {
    console.error('Error creating category:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;


    const categories = await Category.find()
    .skip((page - 1) * limit)
    .limit(limit);

    const totalCategorys = await Category.countDocuments();


    res.status(200).json({
      categories,
      totalCategorys,
      currentPage: page,
      totalPages: Math.ceil(totalCategorys / limit),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Update the category
const updateCategory = async (req, res) => {
  try {
    const { name, status, image, offerPercentage } = req.body;
    const { id: categoryId } = req.params;

    console.log(req.body);

    const categoryExists = await Category.findOne({
      $and: [
        { name: { $regex: `^${name}$`, $options: 'i' } },
        { _id: { $ne: categoryId } },
      ],
    });

    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, status, image, offerPercentage },
      { new: true }
    );

    console.log(updatedCategory);

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update category', error: error.message });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  updateCategory
};
