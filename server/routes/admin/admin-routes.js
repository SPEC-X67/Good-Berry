const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multer');
const categoryController = require('../../controllers/admin/category-controller');
const userController = require('../../controllers/admin/user-controller');
const productController = require('../../controllers/admin/product-controller');

//Coustomer
router.get('/users', userController.getAllUsers);
router.patch('/users/:id/block', userController.updateUser);

// Product
router.get('/products', productController.getAllProducts);
router.post(
    '/products', upload.array('images', 10), productController.addProduct
);

router.get('/products/:id', productController.getProduct);
router.put('/products/:id', productController.updateProduct);
router.patch('/products/:id', productController.removeProduct);

// Category
router.post('/categories', categoryController.addCategory);
router.get('/categories', categoryController.getAllCategories);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;
