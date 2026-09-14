import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc   Get admin dashboard analytics & KPI stats
// @route  GET /api/admin/stats
// @access Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    const orders = await Order.find();
    const totalSales = orders.reduce((acc, order) => {
      // Exclude cancelled orders from total sales
      return order.orderStatus !== 'Cancelled' ? acc + (order.totalPrice || 0) : acc;
    }, 0);

    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['Order Placed', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery'] }
    });

    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select('name brand category stock price images')
      .limit(10);

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Category breakdown
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Order status breakdown
    const statusStats = {
      placed: await Order.countDocuments({ orderStatus: 'Order Placed' }),
      confirmed: await Order.countDocuments({ orderStatus: 'Confirmed' }),
      processing: await Order.countDocuments({ orderStatus: 'Processing' }),
      shipped: await Order.countDocuments({ orderStatus: 'Shipped' }),
      outForDelivery: await Order.countDocuments({ orderStatus: 'Out for Delivery' }),
      delivered: deliveredOrders,
      cancelled: cancelledOrders
    };

    res.json({
      totalSales: Number(totalSales.toFixed(2)),
      totalOrders,
      totalProducts,
      totalUsers,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockProducts,
      recentOrders,
      categoryStats,
      statusStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all registered users for admin
// @route  GET /api/admin/users
// @access Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });

    // Attach order count for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({ user: u._id });
        return {
          ...u.toObject(),
          orderCount
        };
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Toggle user active status (activate/deactivate)
// @route  PUT /api/admin/users/:id/toggle-status
// @access Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
