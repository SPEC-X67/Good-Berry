const Category = require('../../models/Categorys.js');

// Add Category
const addCategory = async (req, res) => {
  try {
    const { name, status } = req.body;

    // Check for existing category with case-insensitive regex
    const existingCategory = await Category.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });

    if (existingCategory) {
      return res.json({ success: false, message: 'Category already exists' });
    }

    // Create the new category
    const category = await Category.create({ name, status });
    return res.status(201).json({ success: true, message: 'Category created successfully', category });

  } catch (error) {
    console.error('Error creating category:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Update the category
const updateCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    const { id: categoryId } = req.params;

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
      { name, status },
      { new: true }
    );

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



// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.deleteOne({ _id: categoryId });
    res.status(200).json({ success : true, message: 'Category deleted successfully', categoryId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};
