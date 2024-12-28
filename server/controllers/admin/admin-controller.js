const User = require('../../models/User');
const {Category }= require('../../models/ProductsCategorys');

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const { isBlocked } = req.body; // Expecting `isBlocked` value from the frontend
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(userId, { isBlocked }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add Category
const addCategory = async (req, res) => {
  try {

    const { name, status } = req.body;

    const existingCategory = await Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });

    console.log(existingCategory);
    if (existingCategory) {
      return res.json({success: false, message: 'Category already exists' });
    }
    const category = await Category.create({ name, status });
    res.json({ success: true, message: 'Category created successfully', category });
    
  } catch (error) {
    res.json({success: false, message: 'Failed to create category', error: error.message });
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

module.exports = {
  getAllUsers,
  updateUser,
  addCategory,
  getAllCategories
};
