const Order = require('../../models/Order');

const orderController = {
  getAllOrders: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search;
      const status = req.query.status;

      let query = {};

      if(status === 'all') {
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
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
  
      const order = await Order.find({orderId : req.params.orderId})
        .populate('addressId');
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Validate status transition
      if (order.status === 'cancelled' || order.status === 'delivered') {
        return res.status(400).json({ 
          message: 'Cannot update status of cancelled or delivered orders' 
        });
      }
  
      order.status = status;
      await order.save();
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error updating order status', 
        error: error.message 
      });
    }
  }
};

module.exports = orderController;
