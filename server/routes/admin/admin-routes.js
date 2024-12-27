const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    updateUser,
    deleteUser,
  } = require('../../controllers/admin/admin-controller');

// GET: Fetch all users
router.get('/users', getAllUsers);

// PUT: Update an existing user
router.put('/users/:id', updateUser);

// DELETE: Remove a user
router.delete('/users/:id', deleteUser);

module.exports = router;
