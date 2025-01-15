const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const Address = require('../../models/Address');

const orderController = {  
  createOrder : async (req, res) => {
    try {
      const { 
        addressId, 
        shippingMethod, 
        paymentMethod 
      } = req.body;
      
      if (!addressId || !shippingMethod || !paymentMethod) {
        return res.status(400).json({ 
          message: 'Address, shipping method, and payment method are required' 
        });
      }

      const address = await Address.findOne({ 
        _id: addressId,
        userId: req.user.id
      });
      
      if (!address) {
        return res.status(400).json({ message: 'Invalid address' });
      }
  
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
  
      const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shippingCost = shippingMethod.price || 0;
      const discount = 0; 
      const total = subtotal + shippingCost - discount;
  
      const order = new Order({
        userId: req.user.id,
        items: cart.items,
        addressId,
        shippingMethod,
        paymentMethod,
        cancellation: {
          reason: '',
          message: '',
          date: null
        },
        subtotal,
        shippingCost,
        discount,
        total,
      });
  
      await order.save();
  
      cart.items = [];
      await cart.save();

      await order.populate('addressId');
      
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error creating order', 
        error: error.message 
      });
    }
  },
  
  getOrders : async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status;
      const search = req.query.search;
      
      let query = { userId: req.user.id}; 

      if(status === 'all') {
        query.status = { $in: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'] };
      } else if (status) {
        query.status = status;
      }

      if (search) {
        query.orderId = { $regex: search, $options: 'i' };
      }

      const orders = await Order.find(query,{status: 1, createdAt: 1, orderId: 1})
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
  
  getOrderById : async (req, res) => {
    try {
      const order = await Order.findOne({ 
        orderId: req.params.id, 
        userId: req.user.id 
      }).populate('addressId');
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching order', 
        error: error.message 
      });
    }
  },
  
  cancelOrder : async (req, res) => {
    try {
      const { productId, reason } = req.body;
  
      if (!reason) {
        return res.status(400).json({ message: 'Cancellation reason is required' });
      }
  
      const order = await Order.findOne({ 
        orderId: req.params.id, 
        userId: req.user.id 
      }).populate('addressId');
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      const item = order.items.find(item => item.productId.toString() === productId);
      if (!item) {
        return res.status(404).json({ message: 'Item not found in order' });
      }
  
      if (item.status !== 'processing') {
        return res.status(400).json({ message: 'Item cannot be cancelled' });
      }
  
      item.status = 'cancelled';
      item.cancellationReason = reason;

      if(order.items.every(item => item.status === 'cancelled')) {
        order.status = 'cancelled';
      }
  
      await order.save();
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error cancelling item', 
        error: error.message 
      });
    }
  },
  
  // Admin controllers
  getAllOrders : async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status;
      const orderId = req.query.orderId;
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
  
      let query = {};
  
      // Add filters
      if (status) query.status = status;
      if (orderId) query.orderId = orderId;
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }
  
      const orders = await Order.find(query)
        .populate('userId', 'name email')
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
  
  updateOrderStatus : async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
  
      const order = await Order.findById(req.params.id)
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