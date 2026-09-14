import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Helper to build default tracking timeline based on current status
const ALL_STATUSES = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

export const buildTimeline = (currentStatus) => {
  const currentIndex = ALL_STATUSES.indexOf(currentStatus);
  return ALL_STATUSES.map((status, index) => ({
    status,
    timestamp: index <= currentIndex ? new Date() : null,
    completed: currentIndex >= 0 && index <= currentIndex,
    description:
      status === 'Order Placed' ? 'Your order has been received and logged.' :
      status === 'Confirmed' ? 'Payment and order verified by our boutique.' :
      status === 'Processing' ? 'Items are being curated in the clean room.' :
      status === 'Packed' ? 'Securely packaged with luxury satin wrap.' :
      status === 'Shipped' ? 'Handed over to priority courier.' :
      status === 'Out for Delivery' ? 'Courier is in transit to your address.' :
      'Order delivered and verified.'
  }));
};

// @desc   Create new order
// @route  POST /api/orders
// @access Private
export const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount,
      couponCode,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Deduct stock for each product
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = Math.max(0, product.stock - (item.qty || 1));
        await product.save();
      }
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      discountAmount: Number(discountAmount) || 0,
      couponCode: couponCode || '',
      totalPrice: Number(totalPrice) || 0,
      orderStatus: 'Order Placed',
      trackingTimeline: buildTimeline('Order Placed'),
      isPaid: paymentMethod === 'Demo Card / Test Payment',
      paidAt: paymentMethod === 'Demo Card / Test Payment' ? Date.now() : null
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged in user orders
// @route  GET /api/orders/myorders
// @access Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get order by ID
// @route  GET /api/orders/:id
// @access Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure only the owner or an admin can access this order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all orders
// @route  GET /api/orders
// @access Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') {
      filter.orderStatus = req.query.status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update order status & tracking
// @route  PUT /api/orders/:id/status
// @access Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { status } = req.body;
    order.orderStatus = status;

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.isPaid = true;
      if (!order.paidAt) order.paidAt = Date.now();
    }

    if (status === 'Cancelled') {
      order.trackingTimeline.push({
        status: 'Cancelled',
        timestamp: new Date(),
        completed: true,
        description: 'Order cancelled.'
      });
    } else {
      order.trackingTimeline = buildTimeline(status);
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Cancel order by customer
// @route  PUT /api/orders/:id/cancel
// @access Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel an order that is already in transit or delivered' });
    }

    order.orderStatus = 'Cancelled';
    order.trackingTimeline.push({
      status: 'Cancelled',
      timestamp: new Date(),
      completed: true,
      description: 'Order cancelled by customer.'
    });

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
