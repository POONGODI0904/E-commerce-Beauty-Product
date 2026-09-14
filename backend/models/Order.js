import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  qty: { type: Number, required: true, default: 1 }
});

const trackingStepSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: true }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    houseFlat: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true, default: 'United States' }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash on Delivery', 'Demo Card / Test Payment']
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String }
  },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  discountAmount: { type: Number, required: true, default: 0.0 },
  couponCode: { type: String, default: '' },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  taxPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  orderStatus: {
    type: String,
    required: true,
    enum: [
      'Order Placed',
      'Confirmed',
      'Processing',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ],
    default: 'Order Placed'
  },
  trackingTimeline: [trackingStepSchema],
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
