const Product = require('../../models/Product');
const Variant = require('../../models/Variant');

const getFeatured = async (req, res) => {
  try {
    const featuredProducts = await Product.aggregate([
      {
        $match: {
          isFeatured: true,
          unListed: false,
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
        $addFields: {
          categoryDetails: { $arrayElemAt: ["$categoryDetails", 0] }, 
        },
      },
      {
        $match: {
          "categoryDetails.status": "Active", 
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          categoryName: "$categoryDetails.name",
          "firstVariant.title": 1,
          "firstVariant.description": 1,
          "firstVariant.price": 1,
          "firstVariant.images": { $arrayElemAt: ["$firstVariant.images", 0] }, 
        },
      },
    ]);

    return res.json({
      success: true,
      data: featuredProducts,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


module.exports = {
  getFeatured
};