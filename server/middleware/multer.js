const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage to access file buffer
const upload = multer({ storage: storage });

module.exports = upload;
 