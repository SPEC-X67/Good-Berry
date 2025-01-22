const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/admin/category-controller');
const userController = require('../controllers/admin/user-controller');
const productController = require('../controllers/admin/product-controller');
const orderController = require('../controllers/admin/order-controller');
const offerController = require('../controllers/admin/offer-controller');
const couponController = require('../controllers/common/coupon-controller');
const salesReportController = require('../controllers/admin/sales-report-controller');

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

// Product Offer
router.post('/products/:id/offer', offerController.addProductOffer);
router.delete('/products/:id/offer', offerController.removeProductOffer);

// Coupon
router.get('/coupons', couponController.getAllCoupons);
router.post('/coupons', couponController.addCoupon);
router.put('/coupons/:id', couponController.updateCoupon);
router.delete('/coupons/:id', couponController.deleteCoupon);

// Order
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.patch('/orders/:orderId/items/:productId', orderController.updateOrderItemStatus);

// Sales Report
router.get('/sales-report', salesReportController.generateSalesReport);

module.exports = router;
