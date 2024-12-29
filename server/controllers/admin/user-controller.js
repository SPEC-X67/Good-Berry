const User = require('../../models/User.js');

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

  module.exports = {
    getAllUsers,
    updateUser,
  };