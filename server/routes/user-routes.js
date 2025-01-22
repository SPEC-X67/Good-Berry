const express = require('express');
const router = express.Router();
const cartController = require('../controllers/user/cart-controller');
const accountController = require('../controllers/user/account-controller');
const addressController = require('../controllers/user/address-controller');
const orderController = require('../controllers/common/order-controller');
const wishlistController = require('../controllers/user/wishlist-controller');
const couponController = require('../controllers/common/coupon-controller');
const paymentController = require('../controllers/common/payment-controller');
const walletController = require('../controllers/user/wallet-controller');
const auth = require('../middleware/auth');

router.use(auth);

// Cart
router.get('/cart', cartController.getCart); 
router.post('/cart', cartController.addToCart);
router.post('/cart/sync', cartController.syncCart);
router.put('/cart/:itemId', cartController.updateQuantity);  
router.delete('/cart/:itemId', cartController.removeItem);  
router.delete('/cart/clear', cartController.clearCart);  

// Account
router.get('/', accountController.getDetails);
router.patch('/', accountController.updateDetails);

// Change Password
router.patch('/change-password', accountController.changePassword);

// Address
router.get('/addresses', addressController.getAllAddresses);
router.post('/addresses', addressController.addAddress);
router.put('/addresses/:id', addressController.updateAddress);
router.put('/addresses/:id/set-default', addressController.setDefaultAddress);
router.delete('/addresses/:id', addressController.deleteAddress);

// Order
router.post('/order', orderController.createOrder);
router.get('/order', orderController.getOrders); 
router.get('/order/:id', orderController.getOrderById);
router.put('/order/:id/cancel', orderController.cancelOrder);
router.put('/order/:id/return', orderController.returnOrderItem);

// Coupons
router.get('/coupons', couponController.getAllCoupons);
router.post('/apply-coupon', couponController.applyCoupon);
router.post('/check-coupon', couponController.checkCoupon);

// Payment 
router.post('/create-razorpay-order', paymentController.createRazorpayOrder);
router.post('/verify-payment', paymentController.verifyPayment);
router.post('/payment-failure', paymentController.handlePaymentFailure);

// Wishlist
router.get('/wishlist', wishlistController.getWishlist);
router.post('/wishlist', wishlistController.addToWishlist);
router.delete('/wishlist/:productId/:variantId', wishlistController.removeFromWishlist);

// Wallet
router.get('/wallet', walletController.getWallet);
router.post('/wallet/add-money', walletController.addMoney);
router.get('/wallet/transactions', walletController.getTransactions);

module.exports = router;