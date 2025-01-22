const Order = require('../../models/Order');
const { subDays, subWeeks, subMonths, subYears, startOfDay, endOfDay } = require('date-fns');

const salesReportController = {
  generateSalesReport: async (req, res) => {
    try {
      const { period, startDate, endDate, page = 1, limit = 10, search = '' } = req.query;

      let start, end;
      const today = new Date();

      switch (period) {
        case 'day':
          start = startOfDay(subDays(today, 1));
          end = endOfDay(today);
          break;
        case 'week':
          start = startOfDay(subWeeks(today, 1));
          end = endOfDay(today);
          break;
        case 'month':
          start = startOfDay(subMonths(today, 1));
          end = endOfDay(today);
          break;
        case 'year':
          start = startOfDay(subYears(today, 1));
          end = endOfDay(today);
          break;
        case 'custom':
          start = startOfDay(new Date(startDate));
          end = endOfDay(new Date(endDate));
          break;
        default:
          return res.status(400).json({ message: 'Invalid period' });
      }

      const query = {
        createdAt: {
          $gte: start,
          $lte: end
        }
      };

      if (search) {
        query.$or = [
          { orderId: { $regex: search, $options: 'i' } },
          { 'userId.username': { $regex: search, $options: 'i' } }
        ];
      }

      const totalOrders = await Order.countDocuments(query);
      const orders = await Order.find(query)
        .populate('userId', 'username')
        .populate('addressId')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const overallOrders = await Order.find(query)
        .populate('userId', 'username')
        .populate('addressId')
        .sort({ createdAt: -1 });

      const report = {
        period,
        startDate: start,
        endDate: end,
        orders,
        overallSalesCount: overallOrders.reduce((sum, order) => sum + order.items.length, 0),
        overallOrderCount: overallOrders.length,
        overallOrderAmount: overallOrders.reduce((sum, order) => sum + order.total, 0),
        overallDiscount: overallOrders.reduce((sum, order) => sum + order.discount, 0),
        overallCouponDiscount: overallOrders.reduce((sum, order) => sum + order.couponDiscount, 0),
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders
      };

      res.json(report);
    } catch (error) {
      console.error('Error generating sales report:', error);
      res.status(500).json({ message: 'Error generating sales report', error: error.message });
    }
  }
};

module.exports = salesReportController;
