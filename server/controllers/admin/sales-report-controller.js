const Order = require('../../models/Order');
const { subDays, subWeeks, subMonths, subYears, startOfDay, endOfDay } = require('date-fns');

const salesReportController = {
  generateSalesReport: async (req, res) => {
    try {
      const { period, startDate, endDate } = req.query;

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

      const orders = await Order.find({
        createdAt: {
          $gte: start,
          $lte: end
        }
      }).populate('userId', 'username').populate('addressId');

      const report = {
        period,
        startDate: start,
        endDate: end,
        orders,
        overallSalesCount: orders.reduce((sum, order) => sum + order.items.length, 0),
        overallOrderCount: orders.length,
        overallOrderAmount: orders.reduce((sum, order) => sum + order.total, 0),
        overallDiscount: orders.reduce((sum, order) => sum + order.discount, 0),
        overallCouponDiscount: orders.reduce((sum, order) => sum + order.couponDiscount, 0)
      };

      res.json(report);
    } catch (error) {
      console.error('Error generating sales report:', error);
      res.status(500).json({ message: 'Error generating sales report', error: error.message });
    }
  }
};

module.exports = salesReportController;
