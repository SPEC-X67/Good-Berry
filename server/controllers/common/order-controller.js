const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const Address = require('../../models/Address');
const Variant = require('../../models/Variant');
const Wallet = require('../../models/Wallet');
const Coupon = require('../../models/Coupon');
const User = require('../../models/User');

const orderController = {  
  createOrder : async (req, res) => {
    try {
      const { 
        addressId, 
        shippingMethod, 
        paymentMethod,
        discount,
        coupon,
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

      for (const cartItem of cart.items) {
        const variant = await Variant.findOne({ productId: cartItem.productId, title : cartItem.flavor });
        console.log("Varient",variant);

        if (!variant) {
          return res.status(400).json({ 
            message: `Product variant not found for product ID: ${cartItem.productId}` 
          });
        }

        const packSize = variant.packSizePricing.find(
          pack => pack.size === cartItem.packageSize
        );

        if (!packSize) {
          return res.status(400).json({ 
            message: `Pack size ${cartItem.packageSize} not found for this product` 
          });
        }

        if (packSize.quantity < cartItem.quantity) {
          return res.status(400).json({ 
            message: `Insufficient quantity available for ${cartItem.name}. Required: ${cartItem.quantity}, Available: ${packSize.quantity}` 
          });
        }

        if(paymentMethod == 'cod' || paymentMethod == 'wallet') {
          packSize.quantity -= cartItem.quantity;
        }
        await variant.save();
      }
  
      const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shippingCost = shippingMethod.price || 0;
      const couponDiscount = coupon?.discount || 0;
      const total = subtotal + shippingCost - discount - couponDiscount;
  
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
        subtotal: Number(subtotal),
        shippingCost,
        discount: Number(discount),
        couponDiscount: Number(couponDiscount),
        couponId: coupon?.couponId,
        total: Number(total),
      });

      if (coupon?.couponId) {
        const usedCoupon = await Coupon.findById(coupon.couponId);
        if (usedCoupon) {
          usedCoupon.used += 1;
          await usedCoupon.save();
        }
      }
  
      if(paymentMethod == 'cod' || paymentMethod == 'upi') {
        cart.items = [];
        await cart.save();
      }

      await order.save();
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
        query.status = { $in: ['processing', 'shipped', 'delivered', 'cancelled', 'returned', 'failed'] };
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
  
  cancelOrder: async (req, res) => {
    try {
        const { itemId, reason } = req.body;

        if (!reason) {
            return res.status(400).json({ message: 'Cancellation reason is required' });
        }

        const order = await Order.findOne({
            orderId: req.params.id,
            userId: req.user.id,
        }).populate('addressId').populate('couponId');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const item = order.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in order' });
        }

        if (!['processing', 'delivered'].includes(item.status)) {
            return res.status(400).json({ message: `Item cannot be cancelled in ${item.status} status` });
        }

        const variant = await Variant.findOne({
            productId: item.productId,
            title: item.flavor,
        });

        if (!variant) {
            return res.status(404).json({ message: 'Product variant not found' });
        }

        const packSize = variant.packSizePricing.find(pack => pack.size === item.packageSize);
        if (packSize) {
            packSize.quantity += item.quantity;
            await variant.save();
        }

        item.status = 'cancelled';
        item.cancellationReason = reason;
        item.cancellation = {
            reason,
            date: new Date(),
        };

        const remainingItems = order.items.filter(i => i.status !== 'cancelled');
        order.discount = remainingItems.reduce((total, i) => total + (i.price - i.salePrice) * i.quantity, 0);

        let couponRefundAmount = 0;
        let isCouponRemoved = false;

        if (order.couponId) {
            const remainingTotal = remainingItems.reduce((sum, i) => sum + i.salePrice * i.quantity, 0);
            if (remainingTotal < order.couponId.minimumAmount) {
                couponRefundAmount = order.couponDiscount; 
                order.couponId = null;
                order.couponDiscount = 0;
                isCouponRemoved = true;
            }
        }

        order.subtotal = remainingItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        order.total = order.subtotal - order.couponDiscount - order.discount;

        if (order.items.every(i => i.status === 'cancelled')) {
            order.status = 'cancelled';
        } else if (order.items.some(i => i.status === 'processing')) {
            order.status = 'processing';
        } else if (order.items.some(i => i.status === 'shipped')) {
            order.status = 'shipped';
        } else if (order.items.some(i => i.status === 'delivered')) {
            order.status = 'delivered';
        } else if (order.items.every(i => i.status === 'returned')) {
            order.status = 'returned';
        }

        await order.save();

        if (['wallet', 'upi'].includes(order.paymentMethod)) {
            let wallet = await Wallet.findOne({ userId: req.user.id });
            if (!wallet) {
                wallet = new Wallet({ userId: req.user.id, balance: 0, transactions: [] });
                await wallet.save();
            }

            const refundAmount = isCouponRemoved
                ? (item.salePrice * item.quantity) - couponRefundAmount
                  : (item.salePrice * item.quantity);

            await wallet.refund(refundAmount, `Refund for cancelled item ${item.name}`);
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling item', error: error.message });
    }
  },

  returnOrderItem: async (req, res) => {
    try {
      const { itemId, reason } = req.body;

      if (!reason) {
        return res.status(400).json({ message: 'Return reason is required' });
      }

      const order = await Order.findOne({
        orderId: req.params.id,
        userId: req.user.id
      }).populate('addressId');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      
      const item = order.items.id(itemId);
      console.log(order, item);
      if (!item) {
        return res.status(404).json({ message: 'Item not found in order' });
      }

      if (item.status !== 'delivered') {
        return res.status(400).json({
          message: `Item cannot be returned in ${item.status} status`
        });
      }

      const deliveredDate = new Date(item.deliveredAt);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - deliveredDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 5) {
        return res.status(400).json({
          message: 'Return period has expired. You can only return items within 5 days of delivery.'
        });
      }

      item.returnRequest = true;
      item.returnReason = reason;
      item.status = 'Return Requested';
      item.return = {
        reason,
        message: '',
        date: new Date()
      };

      await order.save();

      res.json(order);
    } catch (error) {
      res.status(500).json({
        message: 'Error requesting return',
        error: error.message
      });
    }
  }
}

module.exports = orderController;