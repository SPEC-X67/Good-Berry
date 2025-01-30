const Order = require('../../models/Order');
const Variant = require('../../models/Variant');
const Product = require('../../models/Product')
const Wallet = require('../../models/Wallet');
const User = require('../../models/User');

const orderController = {
  getAllOrders: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search;
      const status = req.query.status;
      const returnRequests = req.query.returnRequests === 'true';

      let query = {};

      if (status === 'all') {
        query.status = { $in: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'] };
      } else if (status) {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { orderId: { $regex: search, $options: 'i' } },
          { 'userId.username': { $regex: search, $options: 'i' } }
        ];
      }

      if (returnRequests) {
        query['items.returnRequest'] = true;
      }

      const orders = await Order.find(query)
        .populate('userId', 'username')
        .populate('addressId')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Order.countDocuments(query);

      res.json({
        orders,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching orders',
        error: error.message
      });
    }
  },
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findOne({ orderId: req.params.id })
        .populate('userId', 'username email')
        .populate('addressId');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching order details',
        error: error.message
      });
    }
  },

  updateOrderItemStatus: async (req, res) => {
    try {
      const { orderId, productId } = req.params;
      const { status, cancellationReason } = req.body;

      const order = await Order.findById(orderId)
        .populate('userId', 'username')
        .populate('addressId')
        .populate('items.productId')
        .populate('couponId');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const itemIndex = order.items.findIndex(
        (item) => item.productId._id.toString() === productId
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Order item not found' });
      }

      order.items[itemIndex].status = status;

      if (status === 'cancelled') {
        order.items[itemIndex].cancellationReason = cancellationReason;

        const variant = await Variant.findOne({ productId: productId });
        if (variant) {
          const packSize = order.items[itemIndex].packageSize;
          const packSizeIndex = variant.packSizePricing.findIndex(
            (p) => p.size === packSize
          );
          if (packSizeIndex !== -1) {
            variant.packSizePricing[packSizeIndex].quantity += order.items[itemIndex].quantity;
            await variant.save();
          }
        }

        let refundAmount = order.items[itemIndex].salePrice * order.items[itemIndex].quantity;

        if (order.couponId) {
          const remainingItems = order.items.filter(
            (item) => item.status !== 'cancelled'
          );
          const remainingTotal = remainingItems.reduce(
            (sum, item) => sum + item.salePrice * item.quantity,
            0
          );

          if (remainingTotal < order.couponId.minimumAmount) {
            const discountToReverse = order.couponDiscount;
            refundAmount -= discountToReverse;
            order.couponId = null;
            order.couponDiscount = 0;
          }
        }

        if (['wallet', 'upi'].includes(order.paymentMethod)) {
          let wallet = await Wallet.findOne({ userId: order.userId });
          if (!wallet) {
            wallet = new Wallet({ userId: order.userId, balance: 0, transactions: [] });
            await wallet.save();
          }
          await wallet.refund(refundAmount, `Refund for cancelled item ${order.items[itemIndex].name}`);
        }
      }

      if (status === 'delivered') {
        order.paymentStatus = "paid"
        order.items[itemIndex].deliveredAt = new Date();

        // Handle referral bonuses
        const user = await User.findById(order.userId);

        if (user.referredBy && !user.referralBonusApplied) {
          const referrer = await User.findOne({ referralCode: user.referredBy });

          if (referrer) {
            let referrerWallet = await Wallet.findOne({ userId: referrer._id });
            let userWallet = await Wallet.findOne({ userId: user._id });

            if (!referrerWallet) {
              referrerWallet = new Wallet({ userId: referrer._id, balance: 0, transactions: [] });
              await referrerWallet.save(); // Save the new wallet instance
            }

            await referrerWallet.credit(50, 'Referral bonus for referring a new user');

            if (!userWallet) {
              userWallet = new Wallet({ userId: user._id, balance: 0, transactions: [] });
              await userWallet.save();
            }

            await userWallet.credit(25, 'Referral bonus for being referred');


            user.referralBonusApplied = true;
            await user.save();
          }
        }
      }

      const remainingItems = order.items.filter((item) => item.status !== 'cancelled');
      order.subtotal = remainingItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );


      order.discount = remainingItems.reduce(
        (totalDiscount, i) =>
          totalDiscount + (i.price * i.quantity - i.salePrice * i.quantity),
        0
      );

      order.total = order.subtotal - order.couponDiscount - order.discount;

      const allCancelled = order.items.every((item) => item.status === 'cancelled');
      if (allCancelled) {
        order.status = 'cancelled';
      } else {
        const statuses = order.items.map((item) => item.status);
        if (statuses.some((s) => s === 'delivered')) {
          order.status = 'delivered';
        } else if (statuses.some((s) => s === 'shipped')) {
          order.status = 'shipped';
        } else if (statuses.some((s) => s === 'processing')) {
          order.status = 'processing';
        } else if (statuses.every((s) => s === 'returned')) {
          order.status = 'returned';
        }
      }

      await order.save();

      res.json({
        message: 'Order item status updated successfully',
        order,
      });
    } catch (error) {
      console.error('Error updating order item status:', error);
      res.status(500).json({ message: 'Error updating order item status' });
    }
  },

  approveReturnRequest: async (req, res) => {
    try {
      const { orderId, productId } = req.params;

      const order = await Order.findById(orderId)
        .populate('userId', 'username')
        .populate('addressId')
        .populate('items.productId')
        .populate('couponId');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const itemIndex = order.items.findIndex(
        (item) => item.productId._id.toString() === productId
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Order item not found' });
      }

      const item = order.items[itemIndex];

      if (!item.returnRequest) {
        return res.status(400).json({
          message: 'No return request found for this item',
        });
      }

      const variant = await Variant.findOne({ productId: productId });
      if (variant) {
        const packSize = item.packageSize;
        const packSizeIndex = variant.packSizePricing.findIndex(
          (p) => p.size === packSize
        );
        if (packSizeIndex !== -1) {
          variant.packSizePricing[packSizeIndex].quantity += item.quantity;
          await variant.save();
        }
      }

      item.status = 'returned';
      item.returnRequest = false;

      let refundAmount = item.salePrice * item.quantity;

      if (order.couponId) {
        const remainingItems = order.items.filter(
          (i) => i.status !== 'returned'
        );
        const remainingTotal = remainingItems.reduce(
          (sum, i) => sum + i.salePrice * i.quantity,
          0
        );

        if (remainingTotal < order.couponId.minimumAmount) {
          const discountToReverse = order.couponDiscount;
          refundAmount -= discountToReverse;
          order.couponId = null;
          order.couponDiscount = 0;
        }
      }

      const remainingItems = order.items.filter((i) => i.status !== 'returned');
      order.subtotal = remainingItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      order.discount = remainingItems.reduce(
        (totalDiscount, i) =>
          totalDiscount + (i.price * i.quantity - i.salePrice * i.quantity),
        0
      );

      order.total = order.subtotal - order.couponDiscount - order.discount;

      if (['wallet', 'upi'].includes(order.paymentMethod)) {
        let wallet = await Wallet.findOne({ userId: order.userId });
        if (!wallet) {
          wallet = new Wallet({ userId: order.userId, balance: 0, transactions: [] });
          await wallet.save();
        }
        await wallet.refund(refundAmount, `Refund for returned item ${item.name}`);
      }

      const allReturned = order.items.every((item) => item.status === 'returned');
      if (allReturned) {
        order.status = 'returned';
      }

      await order.save();

      res.json({
        message: 'Return request approved and refund processed successfully',
        order,
        refundAmount,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error approving return request',
        error: error.message,
      });
    }
  },


  rejectReturnRequest: async (req, res) => {
    try {
      const { orderId, productId } = req.params;

      const order = await Order.findById(orderId)
        .populate('userId', 'username')
        .populate('addressId')
        .populate('items.productId');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const itemIndex = order.items.findIndex(
        item => item.productId._id.toString() === productId
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Order item not found' });
      }

      const item = order.items[itemIndex];

      if (!item.returnRequest) {
        return res.status(400).json({
          message: 'No return request found for this item'
        });
      }

      item.status = 'delivered';
      item.returnRequest = false;

      await order.save();

      res.json(order);
    } catch (error) {
      res.status(500).json({
        message: 'Error rejecting return request',
        error: error.message
      });
    }
  }
}

module.exports = orderController;
