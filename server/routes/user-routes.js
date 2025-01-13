const express = require('express');
const router = express.Router();
const cartController = require('../controllers/user/cart-controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/cart', cartController.getCart); 
router.post('/cart', cartController.addToCart);
router.post('/cart/sync', cartController.syncCart);
router.put('/cart/:itemId', cartController.updateQuantity);  
router.delete('/cart/:itemId', cartController.removeItem);   
router.delete('/cart/clear', cartController.clearCart);  

module.exports = router;