const Order = require('../../models/Order');
const Variant = require('../../models/Variant');
const Product = require('../../models/Product')

const orderController = {
  getAllOrders: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search;
      const status = req.query.status;

      let query = {};

      if (status === 'all') {
        query.status = { $in: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'] };
      } else if (status) {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { orderId: { $regex: search, $options: 'i' } },
          { 'userId.username': { $regex: search, $options: 'i' } }
        ];
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

  updateOrderItemStatus : async (req, res) => {
    try {
      const { orderId, productId } = req.params;
      const { status, cancellationReason } = req.body;
  
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
  
      // Update the item status
      order.items[itemIndex].status = status;
      if (status === 'cancelled') {
        order.items[itemIndex].cancellationReason = cancellationReason;
        
        // If cancelled, restore the inventory
        const variant = await Variant.findOne({ productId: productId });
        if (variant) {
          const packSize = order.items[itemIndex].packageSize;
          const packSizeIndex = variant.packSizePricing.findIndex(
            p => p.size === packSize
          );
          if (packSizeIndex !== -1) {
            variant.packSizePricing[packSizeIndex].quantity += order.items[itemIndex].quantity;
            await variant.save();
          }
        }
      }
  
      const allCancelled = order.items.every(item => item.status === 'cancelled');
      if (allCancelled) {
        order.status = 'cancelled';
      } else {
        const statuses = order.items.map(item => item.status);
        if (statuses.some(s => s === 'delivered')) {
          order.status = 'delivered';
        } else if (statuses.some(s => s === 'shipped')) {
          order.status = 'shipped';
        } else if (statuses.some(s => s === 'processing')) {
          order.status = 'processing';
        }
      }
  
      await order.save();
  
      res.json(order);
    } catch (error) {
      console.error('Error updating order item status:', error);
      res.status(500).json({ message: 'Error updating order item status' });
    }
  }
}

module.exports = orderController;
