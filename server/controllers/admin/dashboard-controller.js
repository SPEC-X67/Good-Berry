const Order = require('../../models/Order');
const User = require('../../models/User');
const Product = require('../../models/Product');
const Category = require('../../models/Categorys');
const Variant = require('../../models/Variant');

const dashboardController = {
  getDashboardData: async (req, res) => {
    try {
      const timeRange = req.query.timeRange || 'weekly';
      const today = new Date();
      let dateFilter = {};

      switch (timeRange) {
        case 'yearly':
          dateFilter = {
            $gte: new Date(today.getFullYear() - 4, 0, 1),
            $lte: today
          };
          break;
        case 'monthly':
          dateFilter = {
            $gte: new Date(today.getFullYear(), 0, 1),
            $lte: today
          };
          break;
        case 'weekly':
          const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateFilter = {
            $gte: lastWeek,
            $lte: today
          };
          break;
      }

      const totalRevenue = await Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]);

      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      const lastMonthRevenue = await Order.aggregate([
        {
          $match: {
            status: 'delivered',
            createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
          }
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]);

      const newCustomers = await User.countDocuments({
        createdAt: { $gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) }
      });

      const lastMonthCustomers = await User.countDocuments({
        createdAt: {
          $gte: lastMonthStart,
          $lte: lastMonthEnd
        }
      });

      const totalSales = await Order.countDocuments({ status: 'delivered' });
      const lastMonthSales = await Order.countDocuments({
        status: 'delivered',
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
      });

      const activeUsers = await User.countDocuments({
        isBlocked: false,
        lastActivity: { $gte: new Date(today.getTime() - 60 * 60 * 1000) } // Last hour
      });

      const recentSales = await Order.find({ status: 'delivered' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'username email')
        .select('total createdAt userId orderId');

      const overviewData = await Order.aggregate([
        {
          $match: {
            status: 'delivered',
            createdAt: dateFilter
          }
        },
        {
          $group: {
            _id: timeRange === 'yearly'
              ? { $year: '$createdAt' }
              : timeRange === 'monthly'
                ? { $month: '$createdAt' }
                : { $dayOfWeek: '$createdAt' },
            total: { $sum: '$total' }
          }
        },
        { $sort: { '_id': 1 } }
      ]);

      const top10Products = await Order.aggregate([
        { $match: { status: 'delivered' } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            totalSales: { $sum: '$items.quantity' }
          }
        },
        { $sort: { totalSales: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $project: {
            name: { $arrayElemAt: ['$product.name', 0] },
            sales: '$totalSales'
          }
        }
      ]);

      const top10Categories = await Order.aggregate([
        { $match: { status: 'delivered' } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $group: {
            _id: { $arrayElemAt: ['$product.category', 0] },
            totalSales: { $sum: '$items.quantity' }
          }
        },
        { $sort: { totalSales: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $project: {
            name: { $arrayElemAt: ['$category.name', 0] },
            sales: '$totalSales'
          }
        }
      ]);

      const revenueChange = lastMonthRevenue[0]
        ? ((totalRevenue[0]?.total - lastMonthRevenue[0].total) / lastMonthRevenue[0].total) * 100
        : 0;
      const customerChange = ((newCustomers - lastMonthCustomers) / lastMonthCustomers) * 100;
      const salesChange = ((totalSales - lastMonthSales) / lastMonthSales) * 100;

      res.json({
        totalRevenue: {
          value: totalRevenue[0]?.total || 0,
          change: revenueChange.toFixed(1)
        },
        newCustomers: {
          value: newCustomers,
          change: customerChange.toFixed(1)
        },
        totalSales: {
          value: totalSales,
          change: salesChange.toFixed(1)
        },
        activeUsers: {
          value: activeUsers,
          change: 0 
        },
        recentSales: recentSales.map(sale => ({
          orderId: sale.orderId,
          name: sale.userId.username,
          sale: sale.total 
        })),
        overviewData: overviewData.map(data => ({
          name: timeRange === 'yearly'
            ? data._id.toString()
            : timeRange === 'monthly'
              ? new Date(0, data._id - 1).toLocaleString('en-US', { month: 'short' })
              : new Date(2024, 0, data._id).toLocaleString('en-US', { weekday: 'short' }),
          total: data.total
        })),
        top10Products,
        top10Categories
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  }
};

module.exports = dashboardController;