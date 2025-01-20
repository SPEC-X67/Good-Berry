const Coupon = require('../../models/Coupon');

const couponController = {
  // Get all coupons with pagination and search
  getAllCoupons: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const searchQuery = search
        ? {
            $or: [
              { code: { $regex: search, $options: 'i' } },
              { status: { $regex: search, $options: 'i' } },
            ],
          }
        : {};

      const coupons = await Coupon.find(searchQuery)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const totalCoupons = await Coupon.countDocuments(searchQuery);

      res.status(200).json({
        success: true,
        message: "Coupons fetched successfully",
        coupons,
        totalPages: Math.ceil(totalCoupons / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      console.error("Error fetching coupons:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch coupons",
        error: error.message,
      });
    }
  },

  // Add a new coupon
  addCoupon: async (req, res) => {
    try {
      const { code, discount, startDate, endDate, usageLimit, minimumAmount, status } = req.body;

      // Check if coupon code already exists
      const existingCoupon = await Coupon.findOne({ code });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already exists",
        });
      }

      const newCoupon = new Coupon({ code, discount, startDate, endDate, usageLimit, minimumAmount, status });
      const savedCoupon = await newCoupon.save();

      res.status(201).json({
        success: true,
        message: "Coupon added successfully",
        coupon: savedCoupon,
      });
    } catch (error) {
      console.error("Error adding coupon:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add coupon",
        error: error.message,
      });
    }
  },

  // Update a coupon
  updateCoupon: async (req, res) => {
    const { id } = req.params;
    const { code, discount, startDate, endDate, usageLimit, minimumAmount, status } = req.body;

    try {
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        id,
        { code, discount, startDate, endDate, usageLimit, minimumAmount, status },
        { new: true }
      );

      if (!updatedCoupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      res.json({
        success: true,
        message: "Coupon updated successfully",
        coupon: updatedCoupon,
      });
    } catch (error) {
      console.error("Error updating coupon:", error);
      res.status(500).json({ message: "Failed to update coupon", error: error.message });
    }
  },

  // Delete a coupon
  deleteCoupon: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedCoupon = await Coupon.findByIdAndDelete(id);

      if (!deletedCoupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      res.json({
        success: true,
        message: "Coupon deleted successfully",
        coupon: deletedCoupon,
      });
    } catch (error) {
      console.error("Error deleting coupon:", error);
      res.status(500).json({ message: "Failed to delete coupon", error: error.message });
    }
  },
};

module.exports = couponController;
