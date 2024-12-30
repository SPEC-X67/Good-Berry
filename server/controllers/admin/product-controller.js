const Product = require('../../models/Product')
const cloudinary = require('cloudinary').v2

// Add product
const addProduct = async (req, res) => {
    try {
        const { name, description, category, packSizes, flavors, price, stock, bestSeller, sku } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).send('No files uploaded.'); // Exit if no files
        }

        console.log("Files received:", files); // Log the received files

        // Upload images to Cloudinary
        const imageUrls = await Promise.all(
            files.map(file => {
                if (!file.buffer) {
                    throw new Error('Empty file'); // Check for empty file
                }
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result.secure_url);
                    }).end(file.buffer); // Send the binary data to Cloudinary
                });
            })
        );

        const productData = {
            name,
            description,
            category,
            sku,
            packSizes: JSON.parse(packSizes),
            flavors: JSON.parse(flavors),
            price: Number(price),
            stock: Number(stock),
            bestSeller: bestSeller === "true",
            image:  imageUrls, // Array of uploaded image URLs
        };
        // Save product to database
        const product = await Product.create(productData);

        console.log("Product saved:", product);
        res.status(200).send('Products added successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({isDeleted: false});
        res.json({success: true, message: 'Products fetched successfully', products});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Get a single product
const getProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        res.json({success: true, message: 'Product fetched successfully', product});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Update a product
const updateProduct = async (req, res) => {

}

// Delete a product (soft delete)
const removeProduct = async (req, res) => { 
    try {
        const productId = req.params.id;
        await Product.findByIdAndUpdate(productId, {isDeleted: true});
        res.json({success: true, message: 'Product deleted successfully'});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

module.exports = {
    addProduct,
    getAllProducts,
    getProduct,
    updateProduct,  
    removeProduct,
}