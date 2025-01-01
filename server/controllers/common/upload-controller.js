const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const writeStream = cloudinary.uploader.upload_stream(
      {
        folder: 'products',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });

    readStream.pipe(writeStream);
  });
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
      message: 'File uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: error.message,
    });
  }
};

module.exports = {
  uploadImage,
};