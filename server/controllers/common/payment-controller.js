const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../../models/Order');
const Wallet = require('../../models/Wallet');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentController = {
  createRazorpayOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.body.orderId);
      if (!order) {                                   
        return res.status(404).json({ message: 'Order not found' });
      }

      const options = {
        amount: Math.round(order.total * 100), 
        currency: "INR",
        receipt: order.orderId,
      };

      const razorpayOrder = await razorpay.orders.create(options);

      res.json({
        orderId: razorpayOrder.id,
        currency: razorpayOrder.currency,
        amount: razorpayOrder.amount,
      });
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).json({ message: 'Error creating payment order', error: error.message });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        orderData
      } = req.body;

      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
      const digest = shasum.digest('hex');

      if (digest !== razorpaySignature) {
        console.log('Transaction not legitimate:', req.body);
        return res.status(400).json({ message: 'Transaction not legitimate!' });
      }

      const order = await Order.findById(orderData._id);
      if (!order) {
        console.log('Order not found:', orderData._id);
        return res.status(404).json({ message: 'Order not found' });
      }

      order.razorpay = {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature
      };
      order.paymentStatus = 'paid';
      order.status = 'processing';

      order.items.forEach(item => {
        item.status = 'processing';
      })
      await order.save();

      res.json({
        message: 'Payment verified successfully',
        orderId: order.orderId
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ message: 'Error verifying payment', error: error.message });
    }
  },

  handlePaymentFailure: async (req, res) => {
    try {
      const { orderId } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.paymentStatus = 'failed';
      order.status = 'failed'

      order.items.forEach(item => {
        item.status = 'failed';
      })
      await order.save();

      res.json({ message: 'Payment status updated to failed' });
    } catch (error) {
      console.error('Error handling payment failure:', error);
      res.status(500).json({ message: 'Error handling payment failure', error: error.message });
    }
  },

};

module.exports = paymentController;