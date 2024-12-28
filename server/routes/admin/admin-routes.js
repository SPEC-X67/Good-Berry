const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    updateUser,
    addCategory,
    getAllCategories
  } = require('../../controllers/admin/admin-controller');

//Coustomer
router.get('/users', getAllUsers);
router.patch('/users/:id/block', updateUser);

// Category
router.post('/categories', addCategory);
router.get('/categories', getAllCategories);

module.exports = router;
