const Product = require('../../models/Product');
const Variant = require('../../models/Variant');
const mongoose = require('mongoose');

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID'
      });
    }

    const product = await Product.findOne({
      _id: id,
      unListed: false
    }).populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const variants = await Variant.find({ productId: id });

    const variantsFormatted = variants.reduce((acc, variant) => {
      acc[variant.title.toLowerCase().replace(/\s+/g, '')] = {
        title: variant.title,
        description: variant.description,
        images: variant.images,
        packageSizes: variant.selectedPackSizes,
        packSizePricing : variant.packSizePricing,
        stock: variant.availableQuantity
      };
      return acc;
    }, {});

    const recommendedProducts = await Product.aggregate([
      { $match: { category: product.category._id, unListed: false, _id: { $ne: new mongoose.Types.ObjectId(id) } } },
      {
        $lookup: {
          from: 'variants',
          localField: '_id',
          foreignField: 'productId',
          as: 'variants',
        },
      },
      {
        $addFields: {
          firstVariant: { $arrayElemAt: ['$variants', 0] }, // Get the first variant
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          'firstVariant.salePrice': { $arrayElemAt: ['$firstVariant.packSizePricing.salePrice', 0] }, // Get the first sale price
          'firstVariant.images': { $arrayElemAt: ['$firstVariant.images', 0] }, // Get the first image
        },
      },
      { $limit: 5 }, // Limit the number of recommended products
    ]);   // Select only necessary fields

    res.status(200).json({ variantsFormatted, product, recommendedProducts });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      {
        $match: {
          unListed: false,
        },
      },
      {
        $addFields: {
          isNew: {
            $gte: [
              "$createdAt",
              new Date(new Date().setDate(new Date().getDate() - 2)),
            ],
          },
        },
      },
      {
        $lookup: {
          from: "variants",
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },
      {
        $addFields: {
          firstVariant: { $arrayElemAt: ["$variants", 0] },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      }, {
        $match: {
          "categoryDetails.status": "Active",
        },
      },

      {
        $addFields: {
          categoryName: { $arrayElemAt: ["$categoryDetails.name", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          categoryName: 1,
          "firstVariant.title": 1,
          "firstVariant.salePrice": {$arrayElemAt: ["$firstVariant.packSizePricing.salePrice", 0]},
          "firstVariant.images": { $arrayElemAt: ["$firstVariant.images", 0] },
          isNew: 1,
        },
      },
      { $skip: skip },
      { $limit: parseInt(limit, 10) },
    ]);

    const totalCount = await Product.countDocuments({ unListed: false });
    const totalPages = Math.ceil(totalCount / limit);

    return res.json({
      success: true,
      data: products,
      pagination: {
        totalItems: totalCount,
        totalPages: totalPages,
        start: skip + 1,
        end: Math.min(skip + parseInt(limit, 10), totalCount),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


module.exports = { getProductDetails, getAllProducts };