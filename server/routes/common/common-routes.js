const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multer');
const uploadController = require('../../controllers/common/upload-controller');


router.post('/upload', upload.single('image'), uploadController.uploadImage);

module.exports = router;