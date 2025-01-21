const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const uploadController = require('../controllers/common/upload-controller');
const homeController = require('../controllers/common/home-controller');
const shopController = require('../controllers/common/shop-controller');

router.post('/upload', upload.single('image'), uploadController.uploadImage);

router.get('/featured', homeController.getFeatured);
router.get('/products', shopController.getAllProducts);
router.get('/products/:id', shopController.getProductDetails);
router.get('/categories', shopController.getCategories);



module.exports = router;