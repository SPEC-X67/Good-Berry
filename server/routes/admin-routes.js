const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/admin/category-controller');
const userController = require('../controllers/admin/user-controller');
const productController = require('../controllers/admin/product-controller');
const orderController = require('../controllers/admin/order-controller');
const offerController = require('../controllers/admin/offer-controller');

// Customer
router.get('/users', userController.getAllUsers);
router.patch('/users/:id/block', userController.updateUser);

// Product
router.get('/products', productController.getAllProducts);
router.post('/products', productController.addProduct);
router.get('/products/:id', productController.getProduct);
router.put('/products/:id', productController.updateProduct);
router.patch('/products/:id', productController.unListProduct);

// Category
router.post('/categories', categoryController.addCategory);
router.get('/categories', categoryController.getAllCategories);
router.put('/categories/:id', categoryController.updateCategory);

// Offer
router.post('/category/offer', offerController.addCategoryOffer);
router.post('/category/offer/remove', offerController.removeCategoryOffer);

// Order
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.patch('/orders/:orderId/items/:productId', orderController.updateOrderItemStatus);

module.exports = router;
