const express = require('express');
const router = express.Router();
const cartController = require('../controllers/user/cart-controller');
const accountController = require('../controllers/user/account-controller');
const addressController = require('../controllers/user/address-controller');
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

module.exports = router;