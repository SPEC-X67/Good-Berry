const Coupon = require('../../models/Coupon');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');

const couponController = {
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

      const currentDate = new Date();
      for (const coupon of coupons) {
        if (coupon.endDate < currentDate && coupon.status !== 'expired') {
          coupon.status = 'expired';
          await coupon.save();
        }
      }

      for (const coupon of coupons) {
        if (coupon.used >= coupon.usageLimit && coupon.status !== 'inactive' && coupon.status !== 'expired') {
          coupon.status = 'expired';
          await coupon.save();
        }
      }

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
      const { code, description, discount, startDate, endDate, usageLimit, minimumAmount, status } = req.body;

      const existingCoupon = await Coupon.findOne({ code });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already exists",
        });
      }

      const newCoupon = new Coupon({ code, description, discount, startDate, endDate, usageLimit, minimumAmount, status });
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
    const { code, description, discount, startDate, endDate, usageLimit, minimumAmount, status } = req.body;

    try {
      const existingCoupon = await Coupon.findOne({ code, _id: { $ne: id } });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already exists",
        });
      }

      const updatedCoupon = await Coupon.findByIdAndUpdate(
        id,
        { code, description, discount, startDate, endDate, usageLimit, minimumAmount, status },
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

  applyCoupon: async (req, res) => {
    try {
      const { code, total } = req.body;
      const userId = req.user.id;
      console.log(userId)

      const coupon = await Coupon.findOne({ code, status: 'active' });

      if (!coupon) {
        return res.json({
          success: false,
          message: 'Invalid or expired coupon code',
        });
      }

      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.json({
          success: false,
          message: 'Cart not found',
        });
      }

      cart.couponId = coupon._id;
      
      await cart.save();

      if (coupon.startDate > new Date() || coupon.endDate < new Date()) {
        return res.json({
          success: false,
          message: 'Coupon is not valid at this time',
        });
      }

      if (coupon.usageLimit <= coupon.used) {
        return res.json({
          success: false,
          message: 'Coupon usage limit has been reached',
        });
      }

      const existingOrder = await Order.findOne({ userId, couponId: coupon._id });
      if (existingOrder) {
        return res.json({
          success: false,
          message: 'You have already used this coupon',
        });
      }

      if (total < coupon.minimumAmount) {
        return res.json({
          success: false,
          message: `This coupon is only valid for order amounts of ₹${coupon.minimumAmount} or more.`,
        });
      }

      await coupon.save();

      res.status(200).json({
        success: true,
        message: `Coupon applied (${coupon.code} - ${coupon.discount} off)`,
        discount: coupon.discount,
        couponId: coupon._id,
      });
    } catch (error) {
      console.error('Error applying coupon:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to apply coupon',
        error: error.message,
      });
    }
  },

  checkCoupon: async (req, res) => {
    try {
      const { code, total } = req.body;
      const coupon = await Coupon.findOne({ code });
      if (!coupon) return res.json({});

      if(coupon.startDate > new Date() || coupon.endDate < new Date())  return res.json({});

      if (coupon.usageLimit <= coupon.used) return res.json({})

      if (total < coupon.minimumAmount) return res.json({});

      res.json({
        success: true,
        message: 'Coupon found',
        discount: coupon.discount,
        couponId: coupon._id,
      });
    } catch (error) {
      console.error('Error checking coupon:', error);
    }
  },

  getValidCoupons: async (req, res) => {
    try {
      const coupons = await Coupon.find({ status: 'active' });
      
      res.json(coupons);
    } catch (error) {
      console.error('Error fetching valid coupons:', error);
    }
  },
};

module.exports = couponController;