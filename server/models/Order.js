const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
  },
  flavor: String,
  packageSize: String,
  price: {
    type: Number
  },
  salePrice: {
    type: Number
  },
  quantity: {
    type: Number
  },
  image: String,
  status: {
    type: String,
    default: 'processing'
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  returnReason: {
    type: String,
    default: ''
  }
});

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [OrderItemSchema],
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  shippingMethod: {
    id: String,
    name: String,
    price: Number
  },
  paymentMethod: String,
  paymentStatus: {
    type: String,
    default: 'pending'
  },
  status: {
    type: String, 
    default: 'processing'
  },
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String
  },
  subtotal: Number,
  shippingCost: Number,
  couponDiscount: Number,
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  discount: Number,
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

async function generateOrderId() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  const todayStart = new Date(date.setHours(0, 0, 0, 0));
  const todayEnd = new Date(date.setHours(23, 59, 59, 999));
  
  const count = await mongoose.model('Order').countDocuments({
    createdAt: {
      $gte: todayStart,
      $lte: todayEnd
    }
  });

  const sequence = (count + 1).toString().padStart(4, '0');
  
  return `ORD${year}${month}${day}${sequence}`;
}

OrderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    this.orderId = await generateOrderId();
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);