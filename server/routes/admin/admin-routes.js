const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    updateUser,
    addCategory
  } = require('../../controllers/admin/admin-controller');

// GET: Fetch all users
router.get('/users', getAllUsers);

// PATCH: Update a user
router.patch('/users/:id/block', updateUser);

router.post('/categories', addCategory);

module.exports = router;
