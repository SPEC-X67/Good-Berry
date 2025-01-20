const Product = require('../../models/Product');
const Variant = require('../../models/Variant');
const mongoose = require('mongoose');
const Category = require('../../models/Categorys');

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
        packSizePricing: variant.packSizePricing,
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
          firstVariant: { $arrayElemAt: ['$variants', 0] },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          'firstVariant.salePrice': { $arrayElemAt: ['$firstVariant.packSizePricing.salePrice', 0] },
          'firstVariant.price': { $arrayElemAt: ['$firstVariant.packSizePricing.price', 0] },
          'firstVariant.images': { $arrayElemAt: ['$firstVariant.images', 0] },
        },
      },
      { $limit: 5 },
    ]);

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
    const {
      page = 1,
      limit = 10,
      sort = 'featured',
      search = '',
      minPrice = 0,
      maxPrice = 1000000,
      categories = []
    } = req.query;

    const skip = (page - 1) * limit;

    const categoryArray = typeof categories === 'string' ? categories.split(',') : categories;

    const sortConfigurations = {
      'price-asc': { 'firstVariant.salePrice': 1 },
      'price-desc': { 'firstVariant.salePrice': -1 },
      'rating': { 'averageRating': -1 },
      'featured': { 'featured': -1, 'createdAt': -1 },
      'new-arrivals': { 'createdAt': -1 },
      'name-asc': { 'name': 1 },
      'name-desc': { 'name': -1 }
    };

    const sortStage = { $sort: sortConfigurations[sort] || sortConfigurations['featured'] };

    const searchPipeline = search ? [
      {
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'categoryDetails.name': { $regex: search, $options: 'i' } }
          ]
        }
      }
    ] : [];

    const categoryFilter = categoryArray.length > 0 ? {
      category: { 
        $in: categoryArray.map(cat => new mongoose.Types.ObjectId(cat))
      }
    } : {};

    const products = await Product.aggregate([
      {
        $match: {
          unListed: false,
          ...categoryFilter
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
      },
      {
        $match: {
          "categoryDetails.status": "Active",
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "productId",
          as: "reviews"
        },
      },
      {
        $addFields: {
          categoryName: { $arrayElemAt: ["$categoryDetails.name", 0] },
          averageRating: { $avg: "$reviews.rating" },
          inStock: { $gt: ["$firstVariant.packSizePricing.quantity", 0] }
        },
      },
      ...searchPipeline,
      {
        $match: {
          $and: [
            { "firstVariant.packSizePricing.salePrice": { $gte: parseFloat(minPrice) } },
            { "firstVariant.packSizePricing.salePrice": { $lte: parseFloat(maxPrice) } }
          ]
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          categoryName: 1,
          "firstVariant.title": 1,
          "firstVariant.salePrice": { $arrayElemAt: ["$firstVariant.packSizePricing.salePrice", 0] },
          "firstVariant.price": { $arrayElemAt: ["$firstVariant.packSizePricing.price", 0] },
          "firstVariant.images": { $arrayElemAt: ["$firstVariant.images", 0] },
          "firstVariant.packSizePricing.quantity": 1,
          isNew: 1,
          featured: 1,
          averageRating: 1,
          createdAt: 1,
          inStock: 1
        },
      },
      sortStage,
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);

    const matchStage = {
      $match: {
        unListed: false,
        ...categoryFilter,
        ...(search && {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'categoryDetails.name': { $regex: search, $options: 'i' } }
          ]
        })
      }
    };

    const totalCount = await Product.aggregate([
      matchStage,
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
        $match: {
          $and: [
            { "firstVariant.packSizePricing.salePrice": { $gte: parseFloat(minPrice) } },
            { "firstVariant.packSizePricing.salePrice": { $lte: parseFloat(maxPrice) } }
          ]
        }
      },
      { $count: "total" }
    ]).then(result => (result[0]?.total || 0));

    const totalPages = Math.ceil(totalCount / limit);

    return res.json({
      success: true,
      data: products,
      pagination: {
        totalItems: totalCount,
        totalPages: totalPages,
        start: skip + 1,
        end: Math.min(skip + parseInt(limit), totalCount),
        currentPage: parseInt(page)
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $match: {
          status: 'Active'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $project: {
          name: 1,
          image: 1,
          count: {
            $size: {
              $filter: {
                input: '$products',
                as: 'product',
                cond: { $eq: ['$$product.unListed', false] }
              }
            }
          }
        }
      },
      {
        $sort: {
          name: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
module.exports = { getProductDetails, getAllProducts, getCategories };